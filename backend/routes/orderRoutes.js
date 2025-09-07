
const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// helper to format currency
const fmt = (n) => `Rs. ${Number(n || 0).toFixed(2)}`;


function generateInvoicePdf(order, userObj, filePath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const leftX = doc.page.margins.left;

      // --- BRAND HEADER ---
      doc.font("Helvetica-Bold").fontSize(22).fillColor("#2E7D32");
      doc.text("VegShop", { align: "center" });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(10).fillColor("#555");
      doc.text(`${process.env.EMAIL_FROM || process.env.SMTP_USER || ""}`, { align: "center" });
      doc.moveDown(1);

      // --- INVOICE TITLE & META ---
      doc.font("Helvetica-Bold").fontSize(14).fillColor("#000");
      doc.text("Tax Invoice", { align: "center" });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(10);
      doc.text(`Invoice ID: ${order._id}`, { align: "center" });
      doc.text(`Order Date: ${new Date(order.orderDate || Date.now()).toLocaleString()}`, { align: "center" });

      doc.moveDown(1.5);

      // --- BILLING INFO ---
      doc.rect(leftX, doc.y, pageWidth, 60).stroke();
      const billingTop = doc.y + 8;

      doc.font("Helvetica-Bold").fontSize(11).text("Billed To:", leftX + 10, billingTop);
      doc.font("Helvetica").fontSize(10).text(userObj.name || "Customer", leftX + 10, doc.y);
      doc.text(userObj.email || "", leftX + 10, doc.y);

      doc.font("Helvetica-Bold").text("Order Summary", leftX + pageWidth - 180, billingTop);
      doc.font("Helvetica").fontSize(10).text(`Invoice ID: ${order._id}`, leftX + pageWidth - 180, doc.y);
      doc.text(`Total: ${fmt(order.grandTotal)}`, leftX + pageWidth - 180, doc.y);

      doc.moveDown(2);

      // ITEMS TABLE 
      const tableTopY = doc.y;
      const col = {
        item: leftX + 10,
        price: leftX + Math.round(pageWidth * 0.55),
        qty: leftX + Math.round(pageWidth * 0.75),
        total: leftX + Math.round(pageWidth * 0.85),
      };

      // Header row
      doc.rect(leftX, tableTopY, pageWidth, 20).fillOpacity(0.1).fill("#f2f2f2").stroke();
      doc.fillOpacity(1).fillColor("#000").font("Helvetica-Bold").fontSize(10);
      doc.text("Item", col.item, tableTopY + 5);
      doc.text("Price", col.price, tableTopY + 5, { width: col.qty - col.price - 10, align: "right" });
      doc.text("Qty", col.qty, tableTopY + 5, { width: col.total - col.qty - 10, align: "right" });
      doc.text("Total", col.total, tableTopY + 5, { align: "right" });

      let rowY = tableTopY + 25;
      const rowHeight = 20;

      doc.font("Helvetica").fontSize(10);

      order.items.forEach((it, idx) => {
        const price = Number(it.price || 0);
        const qty = Number(it.quantity || 0);
        const total = Number(it.totalPrice ?? price * qty);

        if (idx % 2 === 1) {
          doc.rect(leftX, rowY - 5, pageWidth, rowHeight).fillOpacity(0.05).fill("#f9f9f9").stroke();
          doc.fillOpacity(1);
        }

        doc.fillColor("#000").text(it.name || "Item", col.item, rowY);
        doc.text(fmt(price), col.price, rowY, { width: col.qty - col.price - 10, align: "right" });
        // doc.text(String(qty), col.qty, rowY, { width: col.total - col.qty - 10, align: "right" });
        doc.text(`${qty} Kg`, col.qty, rowY, { width: col.total - col.qty - 10, align: "right" });
        doc.text(fmt(total), col.total, rowY, { align: "right" });

        rowY += rowHeight;
      });

      // Totals
      doc.moveTo(leftX, rowY).lineTo(leftX + pageWidth, rowY).stroke();
      rowY += 10;
      doc.font("Helvetica-Bold").fontSize(12);
      doc.text("Grand Total:", col.qty, rowY, { width: col.total - col.qty - 10, align: "right" });
      doc.text(fmt(order.grandTotal), col.total, rowY, { align: "right" });

      // Footer
      doc.moveDown(1.5);
      const contactEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || "";
      doc.font("Helvetica").fontSize(10).fillColor("#333");
      doc.text("Thank you for shopping with VegShop!",leftX, doc.y, { width: pageWidth, align: "center"});
      doc.moveDown(0.3);
      doc.text(`For queries, contact: ${contactEmail}`,leftX, doc.y, {  width: pageWidth, align: "center", link: `mailto:${contactEmail}` });

      doc.end();

      stream.on("finish", () => resolve());
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}


router.post("/place-order", protect, async (req, res) => {
  try {
    const { items, grandTotal, orderDate } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty!" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user id missing" });

    // fetch user
    const user = await User.findById(userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.email) {
      return res.status(400).json({ message: "User email missing. Cannot send receipt." });
    }

    // Save order
    const newOrder = new Order({
      userId,
      items,
      grandTotal,
      orderDate: orderDate || new Date(),
    });
    await newOrder.save();

    // receipts folder
    const receiptsDir = path.join(__dirname, "..", "receipts");
    await fs.promises.mkdir(receiptsDir, { recursive: true });

    // Generate PDF
    const pdfPath = path.join(receiptsDir, `VegShop_Order_${newOrder._id}.pdf`);
    await generateInvoicePdf(
      {
        _id: newOrder._id,
        items,
        grandTotal,
        orderDate: newOrder.orderDate,
      },
      { name: user.name || "Customer", email: user.email },
      pdfPath
    );

    // Email setup
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPass) {
      console.warn("SMTP_USER or SMTP_PASS not set in environment");
      return res.status(500).json({ message: "Email service not configured on server." });
    }

    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: smtpUser, pass: smtpPass },
      });
    } else {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });
    }

    const mailFrom = process.env.EMAIL_FROM || smtpUser;
    const contactEmail = process.env.EMAIL_FROM || smtpUser;

    
    const mailOptions = {
      from: `"VegShop" <${mailFrom}>`,
      to: user.email,
      subject: `Your VegShop Receipt - Order ${newOrder._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; color:#333;">
          <p>Hi ${user.name || "Customer"},</p>
          <p>Thank you for your order. Your invoice is attached as a PDF file.</p>
          <p><strong>Order ID:</strong> ${newOrder._id}<br/>
             <strong>Grand Total:</strong> ${fmt(grandTotal)}</p>
          <p>If you have any questions, please contact us at <a href="mailto:${contactEmail}">${contactEmail}</a>.</p>
          <p>Best regards,<br/>VegShop Team</p>
        </div>
      `,
      text: `Hi ${user.name || "Customer"},\n\nThank you for your order.\nOrder ID: ${newOrder._id}\nGrand Total: ${fmt(
        grandTotal
      )}\n\nFor queries: ${contactEmail}\n\nBest regards,\nVegShop Team`,
      attachments: [
        {
          filename: path.basename(pdfPath),
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Order placed successfully! Receipt emailed.",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error("Place-order error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = router;




