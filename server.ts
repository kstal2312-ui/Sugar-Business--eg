import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_TRANSLATIONS, DEFAULT_SERVICE_PROVIDERS } from './src/data_defaults';

const app = express();
const PORT = 3000;

// Root-level logger to debug incoming requests
app.use((req, res, next) => {
  console.log(`[HTTP] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const DB_FILE = path.join(process.cwd(), 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Increase JSON payload size limits for image uploads (Base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure uploads directory exists and is served statically with high-performance Cache-Control headers
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '365d',
  immutable: true
}));

// Read internal DB or generate default
function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      let changed = false;
      if (!data.flashSales) {
        data.flashSales = [];
        changed = true;
      }
      if (!data.products) {
        data.products = [
          {
            id: "prod-1",
            title: "كارت شوجر البلاتيني للخدمات والمزايا الذكية",
            price: 750,
            description: "العضوية السنوية البلاتينية الحصرية لتوفير كافة العروض والخصومات والخدمات الصحية بمستشفيات ومعامل جمهورية مصر العربية.",
            photoUrl: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=400",
            providerName: "مؤسسة شوجر بيزنس الرئيسية",
            createdAt: new Date().toISOString()
          },
          {
            id: "prod-2",
            title: "باقة الأثاث الفاخر للعروس المعتمدة لعام 2026",
            price: 45000,
            description: "صالون فاخر مصنوع بالكامل من خشب الزان الروماني عالي الجودة بتطريز مذهب، خصيصاً لمستفيدي شوجر بيزنس.",
            photoUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400",
            providerName: "معرض النخبة للأثاث المنزلي والمطابخ",
            createdAt: new Date().toISOString()
          },
          {
            id: "prod-3",
            title: "الفحوصات الطبية الدورية الموجهة للموظفين والشركاء",
            price: 350,
            description: "باقة تحاليل شاملة للدم، الكبد، الكلى، والسكري مع تقرير طبي رسمي معتمد بخصم خاص جداً.",
            photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
            providerName: "سلسلة معامل التميز للتحاليل الطبية",
            createdAt: new Date().toISOString()
          }
        ];
        changed = true;
      }
      if (!data.orders) {
        data.orders = [];
        changed = true;
      }
      if (!data.recruitmentRequests) {
        data.recruitmentRequests = [];
        changed = true;
      }
      if (!data.serviceAdditionRequests) {
        data.serviceAdditionRequests = [];
        changed = true;
      }
      if (!data.passwordResetRequests) {
        data.passwordResetRequests = [];
        changed = true;
      }
      if (!data.transactions) {
        data.transactions = [];
        changed = true;
      }
      if (!data.trackingEvents) {
        data.trackingEvents = [];
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      }
      return data;
    }
  } catch (err) {
    console.error("Error reading database file, using defaults", err);
  }

  const initialDB = {
    settings: {
      whatsappNumber: "201022334455",
      bannerText: "تنبيه هام ومبشر لشهر مايو 2026: تم تفعيل باقات العوائد السنوية الهيكلية بنسبة 40% لأول 100 مستثمر جديد في مصر!",
      showNotification: true
    },
    translations: DEFAULT_TRANSLATIONS,
    users: [
      {
        phone: "01026541250",
        name: "المدير العام عبد الله",
        nationalId: "29801010123456",
        password: "abdallah112021",
        role: "admin",
        approved: true,
        allowedGovs: ["all"]
      },
      {
        phone: "01234567890",
        name: "Trial User",
        nationalId: "29800000000000",
        password: "trialpassword",
        role: "user",
        approved: true,
        allowedGovs: ["all"]
      }
    ],
    providers: DEFAULT_SERVICE_PROVIDERS,
    flashSales: [],
    products: [
      {
        id: "prod-1",
        title: "كارت شوجر البلاتيني للخدمات والمزايا الذكية",
        price: 750,
        description: "العضوية السنوية البلاتينية الحصرية لتوفير كافة العروض والخصومات والخدمات الصحية بمستشفيات ومعامل جمهورية مصر العربية.",
        photoUrl: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=400",
        providerName: "مؤسسة شوجر بيزنس الرئيسية",
        createdAt: new Date().toISOString()
      },
      {
        id: "prod-2",
        title: "باقة الأثاث الفاخر للعروس المعتمدة لعام 2026",
        price: 45000,
        description: "صالون فاخر مصنوع بالكامل من خشب الزان الروماني عالي الجودة بتطريز مذهب، خصيصاً لمستفيدي شوجر بيزنس.",
        photoUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400",
        providerName: "معرض النخبة للأثاث المنزلي والمطابخ",
        createdAt: new Date().toISOString()
      },
      {
        id: "prod-3",
        title: "الفحوصات الطبية الدورية الموجهة للموظفين والشركاء",
        price: 350,
        description: "باقة تحاليل شاملة للدم، الكبد، الكلى، والسكري مع تقرير طبي رسمي معتمد بخصم خاص جداً.",
        photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
        providerName: "سلسلة معامل التميز للتحاليل الطبية",
        createdAt: new Date().toISOString()
      }
    ],
    orders: [],
    recruitmentRequests: [],
    serviceAdditionRequests: [],
    passwordResetRequests: [],
    transactions: [],
    trackingEvents: []
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
  return initialDB;
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing to database file", err);
  }
}

// Ensure database file exists with correct format at boot
readDB();

// API ROUTES First

// Upload endpoint for receiving base64 image data and persisting it to filesystem
app.post('/api/upload', (req, res) => {
  const { adminPhone, filename, base64Data } = req.body;
  
  if (!adminPhone) {
    return res.status(401).json({ success: false, message: "رقم هاتف المسؤول مطلوب لإتمام الرفع." });
  }

  const db = readDB();
  const adminUser = db.users.find((u: any) => u.phone === adminPhone && u.role === 'admin');
  if (!adminUser) {
    return res.status(403).json({ success: false, message: "غير مسموح برفع واستضافة الصور إلا للمسؤول المالي المعتمد." });
  }

  if (!base64Data || !filename) {
    return res.status(400).json({ success: false, message: "البيانات المرسلة غير كاملة." });
  }

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let fileExt = path.extname(filename) || '.png';

    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const uniqueFilename = `img_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}${fileExt}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);
    
    fs.writeFileSync(filePath, buffer);
    
    res.json({
      success: true,
      url: `/uploads/${uniqueFilename}`
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    res.status(500).json({ success: false, message: "فشل حفظ وتخزين الصورة بالنظام: " + err.message });
  }
});

// 0. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// 1. Get entire application data
app.get('/api/app-data', (req, res) => {
  console.log(`[${new Date().toISOString()}] Incoming request for /api/app-data`);
  const db = readDB();
  console.log(`[${new Date().toISOString()}] Sending app data response`);
  res.json({
    success: true,
    settings: db.settings,
    translations: db.translations,
    providers: db.providers,
    flashSales: db.flashSales || [],
    products: db.products || [],
    orders: db.orders || [],
    recruitmentRequests: db.recruitmentRequests || [],
    serviceAdditionRequests: db.serviceAdditionRequests || [],
    passwordResetRequests: db.passwordResetRequests || [],
    transactions: db.transactions || [],
    trackingEvents: db.trackingEvents || [],
    users: db.users.map((u: any) => ({
      phone: u.phone,
      name: u.name,
      nationalId: u.nationalId,
      role: u.role,
      approved: u.approved,
      allowedGovs: u.allowedGovs || ["all"],
      username: u.username,
      identificationCode: u.identificationCode,
      password: u.password,
      email: u.email,
      whatsappEnabled: u.whatsappEnabled,
      emailEnabled: u.emailEnabled,
      followedProductIds: u.followedProductIds || [],
      notifications: u.notifications || []
    })) 
  });
});

// 2. User registration - starts as PENDING (approved: false) unless phone is admin
app.post('/api/users/register', (req, res) => {
  const { phone, name, nationalId, password, identificationCode } = req.body;

  if (!phone || !name || !nationalId || !password) {
    return res.status(400).json({ success: false, message: "فضلاً، أكمل كافة الحقول المطلوبة للتسجيل" });
  }

  const db = readDB();
  const existing = db.users.find((u: any) => u.phone === phone);
  if (existing) {
    return res.status(450).json({ success: false, message: "رقم هذا الهاتف مسجل مسبقاً بالفعل في المنصة." });
  }

  const isFirstAdmin = db.users.length === 0 || phone === "01026541250";
  
  // Use phone as default identificationCode if not provided, or a random one if user wants branding
  const finalIdCode = identificationCode || phone;

  const newUser = {
    phone,
    name,
    nationalId,
    password,
    identificationCode: finalIdCode,
    role: isFirstAdmin ? "admin" : "user",
    approved: isFirstAdmin ? true : false, // False by default, user must get admin's approval
    allowedGovs: isFirstAdmin ? ["all"] : [], // Empty by default until assigned by administrator
    isBlocked: false,
    isInactive: false,
    lastLoginTimestamp: ""
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({
    success: true,
    pending: !newUser.approved,
    user: {
      phone: newUser.phone,
      name: newUser.name,
      nationalId: newUser.nationalId,
      role: newUser.role,
      approved: newUser.approved,
      allowedGovs: newUser.allowedGovs,
      identificationCode: newUser.identificationCode,
      isBlocked: false,
      isInactive: false,
      lastLoginTimestamp: ""
    },
    message: newUser.approved 
      ? "تم إنشاء الحساب الإداري فورا وتفعيله." 
      : "تم استلام طلبك وبناء حسابك بنجاح! حسابك حالياً قيد التوثيق ومراجعة الرقم القومي من قبل الإدارة للتفعيل."
  });
});

// 3. User Login validation
app.post('/api/users/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "يرجى كتابة رقم الهاتف أو الكود الموحد وكلمة المرور" });
  }

  const db = readDB();
  // Allow login by phone OR by identificationCode
  const user = db.users.find((u: any) => 
    (u.phone === phone || u.identificationCode === phone) && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "بيانات الدخول (الهاتف/الكود أو كلمة المرور) غير صحيحة." });
  }

  if (user.isBlocked) {
    return res.json({ 
      success: false, 
      banned: true, 
      message: "عذراً يا شريكنا الكريم؛ لقد تم تجميد وحظر هذا الحساب من قبل الإدارة لمخالفة سياسات الاستخدام التنسيقية للشركة." 
    });
  }

  if (!user.approved && user.role !== 'admin') {
    return res.json({ 
      success: false, 
      pending: true, 
      message: "عذراً يا شريكنا الكريم؛ حسابك قيد التدقيق الإداري حالياً ولم يتم اعتماده بعد. تواصل مع المدير المالي لاعتماده فورا عبر واتساب." 
    });
  }

  user.lastLoginTimestamp = new Date().toISOString();
  writeDB(db);

  res.json({
    success: true,
    user: {
      phone: user.phone,
      name: user.name,
      nationalId: user.nationalId,
      role: user.role,
      approved: user.approved,
      allowedGovs: user.allowedGovs || ["all"],
      isBlocked: user.isBlocked || false,
      isInactive: user.isInactive || false,
      lastLoginTimestamp: user.lastLoginTimestamp
    }
  });
});

// 4. Admin action: Approve/Disapprove user & change assigned allowed governorates
app.post('/api/users/approve', (req, res) => {
  const { adminPhone, targetUserPhone, approved, allowedGovs, role, isBlocked, isInactive } = req.body;

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "عفواً؛ غير مسموح بهذه الصلاحية إلا للمدير الرئيسي أو المشرف المساعد." });
  }

  const targetUser = db.users.find((u: any) => u.phone === targetUserPhone);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: "المستخدم المطلوب غير موجود بسجلات الحسابات" });
  }

  if (approved !== undefined) {
    targetUser.approved = approved;
  }
  if (allowedGovs) {
    targetUser.allowedGovs = allowedGovs;
  }
  if (isBlocked !== undefined) {
    targetUser.isBlocked = isBlocked;
  }
  if (isInactive !== undefined) {
    targetUser.isInactive = isInactive;
  }
  
  // Only the main admin can promote a user to supervisor2 or administrator
  const mainAdmin = db.users.find((u: any) => u.phone === adminPhone && u.role === 'admin');
  if (role && mainAdmin) {
    targetUser.role = role;
  }

  targetUser.processedByName = executive.name;

  writeDB(db);

  res.json({
    success: true,
    message: `تم تحديث حالة ترخيص الحساب ${targetUser.name} بنجاح ومزامنة التغييرات فورا.`,
    users: db.users.map((u: any) => ({
      phone: u.phone,
      name: u.name,
      nationalId: u.nationalId,
      role: u.role,
      approved: u.approved,
      processedByName: u.processedByName,
      allowedGovs: u.allowedGovs || [],
      isBlocked: u.isBlocked || false,
      isInactive: u.isInactive || false,
      lastLoginTimestamp: u.lastLoginTimestamp || "",
      username: u.username,
      identificationCode: u.identificationCode,
      password: u.password,
      email: u.email,
      whatsappEnabled: u.whatsappEnabled,
      emailEnabled: u.emailEnabled,
      followedProductIds: u.followedProductIds || [],
      notifications: u.notifications || []
    }))
  });
});

// 5. Admin action: Add or update Admin status
app.post('/api/users/add-admin', (req, res) => {
  const { adminPhone, phone, name, nationalId, password, role, username, identificationCode } = req.body;

  const db = readDB();
  const adminUser = db.users.find((u: any) => u.phone === adminPhone && u.role === 'admin');
  if (!adminUser) {
    return res.status(403).json({ success: false, message: "عفواً؛ غير مسموح لهذه الصلاحيات إلا للمدير الرئيسي للشركة" });
  }

  const targetRole = role || 'admin';
  const roleName = targetRole === 'admin' ? 'مشرف مالي أول (مدير عام)' : 'مشرف مالي ثانِِ (جغرافي)';

  const existing = db.users.find((u: any) => u.phone === phone);
  if (existing) {
    existing.role = targetRole;
    existing.approved = true;
    existing.allowedGovs = ["all"];
    if (password) {
      existing.password = password;
    }
    if (username) {
      existing.username = username;
    }
    if (identificationCode) {
      existing.identificationCode = identificationCode;
    }
    writeDB(db);
    return res.json({
      success: true,
      message: `تم رصد الحساب مسبقاً وتصعيده ليكون ${roleName}: ${existing.name}`,
      users: db.users.map((u: any) => ({
        phone: u.phone,
        name: u.name,
        role: u.role,
        approved: u.approved,
        allowedGovs: u.allowedGovs,
        username: u.username,
        identificationCode: u.identificationCode,
        password: u.password
      }))
    });
  }

  // Else construct a brand new account directly
  const newAdmin = {
    phone,
    name,
    nationalId: nationalId || "29800000000000",
    password: password || "123456",
    role: targetRole,
    approved: true,
    allowedGovs: ["all"],
    username: username || "",
    identificationCode: identificationCode || ""
  };

  db.users.push(newAdmin);
  writeDB(db);

  res.json({
    success: true,
    message: `تم إضافة وتكويد ${roleName} الجديد بنجاح في المنظومة: ${newAdmin.name}`,
    users: db.users.map((u: any) => ({
      phone: u.phone,
      name: u.name,
      role: u.role,
      approved: u.approved,
      allowedGovs: u.allowedGovs,
      username: u.username,
      identificationCode: u.identificationCode,
      password: u.password
    }))
  });
});

// 6. Admin action: Save single dynamic website word / translation block
app.post('/api/settings/update-translation', (req, res) => {
  const { adminPhone, key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ success: false, message: "يرجى إرسال المفتاح والقيمة المراد تعديلها" });
  }

  const db = readDB();
  const adminUser = db.users.find((u: any) => u.phone === adminPhone && u.role === 'admin');
  if (!adminUser) {
    return res.status(403).json({ success: false, message: "غير مسموح إلا للمدراء بمستودع النصوص." });
  }

  db.translations[key] = value;
  writeDB(db);

  res.json({
    success: true,
    message: "تم حفظ العبارة الجديدة بنجاح ومزامنتها على جميع الأجهزة فوراً.",
    translations: db.translations
  });
});

// 7. Admin action: Update General configurations (WhatsApp number, Notification text)
app.post('/api/settings/update-config', (req, res) => {
  const { adminPhone, whatsappNumber, bannerText, showNotification } = req.body;

  const db = readDB();
  const adminUser = db.users.find((u: any) => u.phone === adminPhone && u.role === 'admin');
  if (!adminUser) {
    return res.status(403).json({ success: false, message: "غير مسموح بتعديل أرقام الإتصال إلا لقادة النظام" });
  }

  if (whatsappNumber !== undefined) db.settings.whatsappNumber = whatsappNumber;
  if (bannerText !== undefined) db.settings.bannerText = bannerText;
  if (showNotification !== undefined) db.settings.showNotification = showNotification;

  writeDB(db);

  res.json({
    success: true,
    message: "تم تحديث الضوابط التشغيلية وعناوين الإتصال بالنجاح التام.",
    settings: db.settings
  });
});

// 8. Admin/Supervisor action: Save/Add or Edit Service Provider
app.post('/api/providers/save', (req, res) => {
  const { adminPhone, provider } = req.body;
  if (!provider || !provider.name || !provider.serviceName) {
    return res.status(400).json({ success: false, message: "بيانات الخدمة غير مكتملة الحفظ" });
  }

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "الولوج مرفوض، الصلاحية مطلوبة للتحكم في معارض ومحلات الخدمة" });
  }

  const index = db.providers.findIndex((p: any) => p.id === provider.id);
  if (index >= 0) {
    // Update
    db.providers[index] = { ...db.providers[index], ...provider };
  } else {
    // Generate fresh id if not present
    const newProv = {
      ...provider,
      id: provider.id || `prov-custom-${Date.now()}`
    };
    db.providers.push(newProv);
  }

  writeDB(db);

  res.json({
    success: true,
    message: `تم معالجة وحفظ مزود الخدمة بنجاح بواسطة المشرف: ${executive.name}.`,
    providers: db.providers
  });
});

// 9. Admin/Supervisor action: Delete Service Provider
app.post('/api/providers/delete', (req, res) => {
  const { adminPhone, providerId } = req.body;

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(433).json({ success: false, message: "الصلاحيات مرفوضة للعملية المرجوة" });
  }

  db.providers = db.providers.filter((p: any) => p.id !== providerId);
  writeDB(db);

  res.json({
    success: true,
    message: "تم استبعاد وبتر مزود الخدمة بنجاح تامي الشفافية.",
    providers: db.providers
  });
});


// 10. Admin action: Save/Add or Edit Flash Sale banner
app.post('/api/flash-sales/save', (req, res) => {
  const { adminPhone, sale } = req.body;
  if (!sale || !sale.govId || !sale.title || !sale.description || !sale.endsAt) {
    return res.status(400).json({ success: false, message: "بيانات العرض العاجل غير مكتملة." });
  }

  const db = readDB();
  const adminUser = db.users.find((u: any) => u.phone === adminPhone && u.role === 'admin');
  if (!adminUser) {
    return res.status(403).json({ success: false, message: "عفواً؛ غير مسموح بهذه الصلاحية إلا للمدير الرئيسي للشركة." });
  }

  db.flashSales = db.flashSales || [];
  const index = db.flashSales.findIndex((s: any) => s.id === sale.id);
  if (index >= 0) {
    // Update
    db.flashSales[index] = { ...db.flashSales[index], ...sale };
  } else {
    // Add new
    const newSale = {
      ...sale,
      id: sale.id || `sale-${Date.now()}`
    };
    db.flashSales.push(newSale);
  }

  writeDB(db);

  res.json({
    success: true,
    message: "تم حفظ وتفعيل العرض الترويجي المؤقت بنجاح.",
    flashSales: db.flashSales
  });
});

// 11. Admin action: Delete Flash Sale
app.post('/api/flash-sales/delete', (req, res) => {
  const { adminPhone, saleId } = req.body;

  const db = readDB();
  const adminUser = db.users.find((u: any) => u.phone === adminPhone && u.role === 'admin');
  if (!adminUser) {
    return res.status(403).json({ success: false, message: "العملية مرفوضة، الصلاحية مطلوبة للتحكم في العروض." });
  }

  db.flashSales = db.flashSales || [];
  db.flashSales = db.flashSales.filter((s: any) => s.id !== saleId);
  writeDB(db);

  res.json({
    success: true,
    message: "تم حذف العرض الترويجي المؤقت بنجاح.",
    flashSales: db.flashSales
  });
});

// 12. E-Commerce: Save Product
app.post('/api/shop/products/save', (req, res) => {
  const { adminPhone, product } = req.body;
  if (!product || !product.title || !product.price) {
    return res.status(400).json({ success: false, message: "بيانات المنتج غير كاملة." });
  }

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "صلاحيات الإشراف أو الإدارة مطلوبة لحفظ المنتجات." });
  }

  db.products = db.products || [];
  const index = db.products.findIndex((p: any) => p.id === product.id);
  if (index >= 0) {
    const oldProd = db.products[index];
    const newPrice = Number(product.price);
    const newReturns = product.returns ? Number(product.returns) : undefined;
    
    // Check for alerts
    const priceDropped = newPrice < oldProd.price;
    const returnsDropped = newReturns !== undefined && oldProd.returns !== undefined && newReturns < oldProd.returns;

    if (priceDropped || returnsDropped) {
      db.users.forEach((u: any) => {
        if (u.followedProductIds && u.followedProductIds.includes(oldProd.id)) {
          const notification = {
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            productId: oldProd.id,
            productTitle: oldProd.title,
            type: priceDropped ? 'price_drop' : 'returns_drop',
            oldValue: priceDropped ? oldProd.price : oldProd.returns,
            newValue: priceDropped ? newPrice : newReturns,
            timestamp: new Date().toISOString(),
            read: false
          };
          u.notifications = u.notifications || [];
          u.notifications.unshift(notification);
        }
      });
    }

    db.products[index] = { ...db.products[index], ...product };
  } else {
    const newProd = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.products.push(newProd);
  }

  writeDB(db);
  res.json({
    success: true,
    message: "تم حفظ ونشر منتج المتجر الإلكتروني بنجاح بالنفوذ الإداري المباشر.",
    products: db.products
  });
});

// 13. E-Commerce: Delete Product
app.post('/api/shop/products/delete', (req, res) => {
  const { adminPhone, productId } = req.body;

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "مرفوض، غير مسموح بحذف المنتجات المعروضة بالمتجر إلا للمسؤولين." });
  }

  db.products = (db.products || []).filter((p: any) => p.id !== productId);
  writeDB(db);
  res.json({
    success: true,
    message: "تم حذف المنتج وإزالته نهائياً من رفوف المتجر الإلكتروني.",
    products: db.products
  });
});

// 14. E-Commerce: Submit Customer Order
app.post('/api/shop/orders/submit', (req, res) => {
  const { userPhone, productId, userAddress, paymentMethod } = req.body;
  
  if (!userPhone || !productId || !userAddress || !paymentMethod) {
    return res.status(400).json({ success: false, message: "يرجى تعبئة العنوان والاسم وطريقة سداد الأوردر بالكامل." });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.phone === userPhone);
  if (!user) {
    return res.status(401).json({ success: false, message: "الحساب غير مسجل أو منتهي الجلسة." });
  }

  const product = (db.products || []).find((p: any) => p.id === productId);
  if (!product) {
    return res.status(444).json({ success: false, message: "عذراً، هذا المنتج غير متوفر حالياً لتكتمل علمية الحجز والطلب." });
  }

  const newOrder = {
    id: `ord-${Date.now()}`,
    productId,
    productTitle: product.title,
    price: product.price,
    userPhone: user.phone,
    userName: user.name,
    userAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.orders = db.orders || [];
  db.orders.push(newOrder);
  writeDB(db);

  res.json({
    success: true,
    message: "تم حجز وإرسال طلب الشراء الخاص بك بنجاح! تتبع حالة عملياتك عبر شاشتك الشخصية.",
    orders: db.orders
  });
});

// 15. E-Commerce: Process/Approve/Reject Shop Order
app.post('/api/shop/orders/process', (req, res) => {
  const { adminPhone, orderId, status } = req.body;

  if (!adminPhone || !orderId || !status) {
    return res.status(400).json({ success: false, message: "خطأ بالبيانات المستلمة." });
  }

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "ولوج مرفوض، الصلاحيات تنسب فقط لمدراء الإدارة التنفيذية والمشرفين." });
  }

  db.orders = db.orders || [];
  const order = db.orders.find((o: any) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "العقد أو الأوردر المطلوب حسم أمره غير مدرج." });
  }

  order.status = status;
  order.processedByName = executive.name; // Log supervisor who processed it!
  writeDB(db);

  res.json({
    success: true,
    message: `تم البت في طلب الشراء بنجاح وتعيينه [${status}] بواسطة المشرف: ${executive.name}.`,
    orders: db.orders
  });
});

// 16. Recruitment: Submit Resume Application
app.post('/api/recruitment/submit', (req, res) => {
  const { name, phone, email, address, about, nationalId, workType, photoUrl, cvUrl } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "الاسم الكامل وهاتف الاتصال ضروريين لإتمام التقديم." });
  }

  const db = readDB();
  const newReq = {
    id: `rec-${Date.now()}`,
    name,
    phone,
    email,
    address,
    about,
    nationalId,
    workType,
    photoUrl,
    cvUrl,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.recruitmentRequests = db.recruitmentRequests || [];
  db.recruitmentRequests.push(newReq);
  writeDB(db);

  res.json({
    success: true,
    message: "تم تسجيل وتعميد طلب التوظيف بنجاح في المنظومة. شكرًا لانضمامك!",
    recruitmentRequests: db.recruitmentRequests
  });
});

// 17. Recruitment: Process Job Application (Approve/Reject)
app.post('/api/recruitment/process', (req, res) => {
  const { adminPhone, requestId, status } = req.body;

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "مرفوض، لا تملك الصلاحيات التشغيلية لمصادقة طلبات التوظيف." });
  }

  db.recruitmentRequests = db.recruitmentRequests || [];
  const request = db.recruitmentRequests.find((r: any) => r.id === requestId);
  if (!request) {
    return res.status(404).json({ success: false, message: "المستند غير متاح للمصادقة." });
  }

  request.status = status;
  request.processedByName = executive.name; // Tag supervisor name!
  writeDB(db);

  res.json({
    success: true,
    message: `تم مصادقة طلب التوظيف بنجاح كـ [${status}] بواسطة المشرف المباشر: ${executive.name}.`,
    recruitmentRequests: db.recruitmentRequests
  });
});

// 18. Service Request: Submit Dynamic Request
app.post('/api/service-requests/submit', (req, res) => {
  const { name, phone, serviceName, sector, region, description } = req.body;

  if (!name || !phone || !serviceName) {
    return res.status(400).json({ success: false, message: "الاسم وهاتف مقدم الخدمة واسم الخدمة هي مدخلات أساسية الحفظ." });
  }

  const db = readDB();
  const newReq = {
    id: `srvreq-${Date.now()}`,
    name,
    phone,
    serviceName,
    sector,
    region,
    description,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.serviceAdditionRequests = db.serviceAdditionRequests || [];
  db.serviceAdditionRequests.push(newReq);
  writeDB(db);

  res.json({
    success: true,
    message: "تم تسلم وتكويد طلب إضافة الخدمة الاستثمارية بالخريطة، وسيقوم المشرفون بدراسته وتنشيطه فوراً.",
    serviceAdditionRequests: db.serviceAdditionRequests
  });
});

// 19. Service Request: Process/Approve addition
app.post('/api/service-requests/process', (req, res) => {
  const { adminPhone, requestId, status } = req.body;

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "صلاحية غير كافية لمراجعة طلبات الانضمام للشركاء." });
  }

  db.serviceAdditionRequests = db.serviceAdditionRequests || [];
  const request = db.serviceAdditionRequests.find((r: any) => r.id === requestId);
  if (!request) {
    return res.status(404).json({ success: false, message: "طلب التراخيص المحدد غير مدرج بنظام الحسابات." });
  }

  request.status = status;
  request.processedByName = executive.name; // Track supervisor!
  writeDB(db);

  res.json({
    success: true,
    message: `تم تحديث حالة طلب الشراكة بنجاح وإلحاقها بـ [${status}] بواسطة: ${executive.name}.`,
    serviceAdditionRequests: db.serviceAdditionRequests
  });
});

// 20. User: Change Password
app.post('/api/users/change-password', (req, res) => {
  const { userPhone, oldPassword, newPassword } = req.body;

  if (!userPhone || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "يرجى تعبئة كافة الحقول المطلوبة." });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.phone === userPhone);
  if (!user) {
    return res.status(404).json({ success: false, message: "المستخدم غير موجود." });
  }

  if (user.password !== oldPassword) {
    return res.status(400).json({ success: false, message: "كلمة المرور القديمة غير صحيحة." });
  }

  user.password = newPassword;
  writeDB(db);

  res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح." });
});

// 21. User: Submit Password Reset Request
app.post('/api/users/password-reset-request', (req, res) => {
  const { phone, nationalId, name } = req.body;

  if (!phone || !nationalId || !name) {
    return res.status(400).json({ success: false, message: "جميع الحقول مطلوبة لإرسال طلب الاستعادة." });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.phone === phone && u.nationalId === nationalId);
  if (!user) {
    return res.status(404).json({ success: false, message: "لم يتم العثور على حساب مطابق لهذه البيانات." });
  }

  const newRequest = {
    id: `reset-${Date.now()}`,
    phone,
    name,
    nationalId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.passwordResetRequests = db.passwordResetRequests || [];
  db.passwordResetRequests.push(newRequest);
  writeDB(db);

  res.json({ success: true, message: "تم إرسال طلب استعادة كلمة المرور بنجاح. يرجى انتظار موافقة الإدارة." });
});

// 22. Admin: Process Password Reset Request
app.post('/api/users/process-password-reset', (req, res) => {
  const { adminPhone, requestId, status, newPassword } = req.body;

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "صلاحية غير كافية." });
  }

  db.passwordResetRequests = db.passwordResetRequests || [];
  const request = db.passwordResetRequests.find((r: any) => r.id === requestId);
  if (!request) {
    return res.status(404).json({ success: false, message: "الطلب غير موجود." });
  }

  request.status = status;
  request.processedByName = executive.name;

  if (status === 'approved' && newPassword) {
    const user = db.users.find((u: any) => u.phone === request.phone);
    if (user) {
      user.password = newPassword;
    }
  }

  writeDB(db);

  res.json({
    success: true,
    message: status === 'approved' ? "تم تعيين كلمة المرور الجديدة والموافقة على الطلب." : "تم رفض طلب استعادة كلمة المرور.",
    passwordResetRequests: db.passwordResetRequests
  });
});

// 23. Admin/Supervisor: Add/Save Transaction Log
app.post('/api/transactions/save', (req, res) => {
  const { adminPhone, transaction } = req.body;

  if (!adminPhone || !transaction || !transaction.userPhone || !transaction.amount || !transaction.type) {
    return res.status(400).json({ success: false, message: "بيانات العملية غير مكتملة." });
  }

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "صلاحية غير كافية لتسجيل المعاملات المالية." });
  }

  const newTransaction = {
    ...transaction,
    id: transaction.id || `tx-${Date.now()}`,
    date: transaction.date || new Date().toISOString(),
    status: transaction.status || 'completed'
  };

  db.transactions = db.transactions || [];
  const index = db.transactions.findIndex((t: any) => t.id === newTransaction.id);
  if (index >= 0) {
    db.transactions[index] = newTransaction;
  } else {
    db.transactions.push(newTransaction);
  }

  writeDB(db);

  res.json({
    success: true,
    message: "تم تسجيل المعاملة المالية بنجاح في سجلات الشريك.",
    transactions: db.transactions
  });
});

// 24. Admin/Supervisor: Delete Transaction Log
app.post('/api/transactions/delete', (req, res) => {
  const { adminPhone, transactionId } = req.body;

  const db = readDB();
  const executive = db.users.find((u: any) => u.phone === adminPhone && (u.role === 'admin' || u.role === 'supervisor2'));
  if (!executive) {
    return res.status(403).json({ success: false, message: "صلاحية غير كافية لحذف السجلات المالية." });
  }

  db.transactions = (db.transactions || []).filter((t: any) => t.id !== transactionId);
  writeDB(db);

  res.json({
    success: true,
    message: "تم حذف السجل المالي بنجاح.",
    transactions: db.transactions
  });
});

// 25. User: Submit Tracking Event
app.post('/api/tracking/event', (req, res) => {
  const { userPhone, userIdCode, type, targetId, targetTitle, category, duration } = req.body;

  if (!userPhone || !type) {
    return res.status(400).json({ success: false });
  }

  const db = readDB();
  const newEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userPhone,
    userIdCode: userIdCode || "",
    type,
    targetId,
    targetTitle,
    category,
    duration: duration || 0,
    timestamp: new Date().toISOString()
  };

  db.trackingEvents = db.trackingEvents || [];
  db.trackingEvents.push(newEvent);
  
  // Keep database size manageable - only keep last 10,000 events
  if (db.trackingEvents.length > 10000) {
    db.trackingEvents = db.trackingEvents.slice(-10000);
  }

  writeDB(db);
  res.json({ success: true });
});

// 26. Admin: Get Computed Customer Intelligence Stats
app.get('/api/tracking/stats', (req, res) => {
  const { adminPhone } = req.query;

  const db = readDB();
  const adminUser = db.users.find((u: any) => u.phone === adminPhone && u.role === 'admin');
  if (!adminUser) {
    return res.status(403).json({ success: false, message: "غير مسموح بالولوج لتقارير الذكاء الاصطناعي إلا للمدراء." });
  }

  const events = db.trackingEvents || [];
  const stats: any[] = [];

  // Group events by user
  const userMap = new Map();
  db.users.forEach((u: any) => {
    userMap.set(u.phone, {
      userPhone: u.phone,
      userIdCode: u.identificationCode || "N/A",
      name: u.name,
      totalTimeSpent: 0,
      lastActive: u.createdAt || "N/A",
      categoryHits: {},
      itemHits: {},
      pathHistory: []
    });
  });

  events.forEach((ev: any) => {
    const user = userMap.get(ev.userPhone);
    if (!user) return;

    if (ev.type === 'heartbeat') {
      user.totalTimeSpent += (ev.duration || 30); // sum up seconds
    }
    
    if (ev.type === 'page_view' || ev.type === 'item_click') {
      if (ev.category) {
        user.categoryHits[ev.category] = (user.categoryHits[ev.category] || 0) + 1;
      }
      if (ev.targetId && ev.targetTitle) {
        user.itemHits[ev.targetId] = user.itemHits[ev.targetId] || { title: ev.targetTitle, count: 0 };
        user.itemHits[ev.targetId].count += 1;
      }
      
      user.pathHistory.push({
        type: ev.type,
        title: ev.targetTitle || ev.category || ev.type,
        timestamp: ev.timestamp
      });
    }

    if (new Date(ev.timestamp) > new Date(user.lastActive || 0)) {
      user.lastActive = ev.timestamp;
    }
  });

  // Convert map to final stats array
  userMap.forEach((user) => {
    // Top category
    let topCat = "N/A";
    let maxHits = 0;
    for (const cat in user.categoryHits) {
      if (user.categoryHits[cat] > maxHits) {
        maxHits = user.categoryHits[cat];
        topCat = cat;
      }
    }

    // Top items
    const topItems = Object.entries(user.itemHits)
      .map(([id, data]: any) => ({ id, title: data.title, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    stats.push({
      userPhone: user.userPhone,
      userIdCode: user.userIdCode,
      name: user.name,
      totalTimeSpent: Math.round(user.totalTimeSpent / 60), // to minutes
      lastActive: user.lastActive,
      mostViewedCategory: topCat,
      mostInterestedItems: topItems,
      pathHistory: user.pathHistory.slice(-10) // Keep last 10 paths
    });
  });

  res.json({
    success: true,
    stats: stats.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
  });
});

// 27. User: Toggle Follow Product for Alerts
app.post('/api/users/toggle-follow', (req, res) => {
  const { userPhone, productId } = req.body;
  if (!userPhone || !productId) return res.status(400).json({ success: false });

  const db = readDB();
  const user = db.users.find((u: any) => u.phone === userPhone);
  if (!user) return res.status(404).json({ success: false });

  user.followedProductIds = user.followedProductIds || [];
  const idx = user.followedProductIds.indexOf(productId);
  if (idx >= 0) {
    user.followedProductIds.splice(idx, 1);
  } else {
    user.followedProductIds.push(productId);
  }

  writeDB(db);
  res.json({ success: true, followedProductIds: user.followedProductIds });
});

// 28. User: Update Alert Profile (Email, WhatsApp)
app.post('/api/users/update-alert-profile', (req, res) => {
  const { userPhone, email, whatsappEnabled, emailEnabled } = req.body;
  if (!userPhone) return res.status(400).json({ success: false });

  const db = readDB();
  const user = db.users.find((u: any) => u.phone === userPhone);
  if (!user) return res.status(404).json({ success: false });

  if (email !== undefined) user.email = email;
  if (whatsappEnabled !== undefined) user.whatsappEnabled = whatsappEnabled;
  if (emailEnabled !== undefined) user.emailEnabled = emailEnabled;

  writeDB(db);
  res.json({ success: true, user: { 
    phone: user.phone, 
    email: user.email, 
    whatsappEnabled: user.whatsappEnabled, 
    emailEnabled: user.emailEnabled 
  }});
});

// 29. User: Mark Notifications as Read
app.post('/api/users/notifications/read', (req, res) => {
  const { userPhone } = req.body;
  const db = readDB();
  const user = db.users.find((u: any) => u.phone === userPhone);
  if (user && user.notifications) {
    user.notifications.forEach((n: any) => n.read = true);
    writeDB(db);
  }
  res.json({ success: true });
});

// 30. Feedback Submission
app.post('/api/feedback', (req, res) => {
  const feedback = {
    id: `fb-${Date.now()}`,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  const db = readDB();
  db.feedback = db.feedback || [];
  db.feedback.unshift(feedback);
  writeDB(db);
  res.json({ success: true });
});


// Integrate Vite middleware in development or static assets in production
async function startServer() {
  console.log(`[FULLSTACK ENGINE] Starting server on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode...`);
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("[FULLSTACK ENGINE] Initializing Vite middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("[FULLSTACK ENGINE] Vite middleware initialized.");
    } else {
      console.log("[FULLSTACK ENGINE] Serving production static files from /dist...");
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath, {
        maxAge: '1d',
        setHeaders: (res, filePath) => {
          // If asset is built with hashing (Vite hashes css/js files inside assets directory)
          if (filePath.includes('/assets/') || filePath.match(/\.[a-f0-9]{8,24}\./)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }
      }));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[FULLSTACK ENGINE] Server is UP AND RUNNING at http://0.0.0.0:${PORT}`);
      console.log(`[FULLSTACK ENGINE] Health check available at http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (err) {
    console.error("[FULLSTACK ENGINE] CRITICAL FAILURE DURING STARTUP:", err);
    process.exit(1);
  }
}

// Global error handler for Express
app.use((err: any, req: any, res: any, next: any) => {
  console.error("[EXPRESS ERROR]", err);
  if (!res.headersSent) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

startServer().catch(err => {
  console.error("[FULLSTACK ENGINE] TOP-LEVEL STARTUP ERROR:", err);
});
