import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Notifications
  app.post("/api/notify", async (req, res) => {
    const { userId, type, title, message, email, phone } = req.body;

    console.log(`[Notification Service] Sending ${type} to user ${userId}`);
    
    // Real-world implementation would use:
    // - SendGrid/Nodemailer for Email
    // - Twilio for WhatsApp/SMS
    
    if (email) {
      console.log(`[Email] To: ${email} | Subject: ${title} | Body: ${message}`);
    }
    
    if (phone) {
      console.log(`[WhatsApp/SMS] To: ${phone} | Message: ${message}`);
    }

    // In a real app, you'd integrate with Twilio/SendGrid here.
    // For this demo, we'll simulate success.
    res.json({ 
      success: true, 
      message: "Notification triggered successfully",
      channels: {
        email: !!email,
        whatsapp: !!phone
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
