# تعديل قسم الشهادات وإضافة نافذة Popup

## 1) ملفات اللوجوهات
ضع ملفات SVG داخل:

`assets/img/cert-logos/`

الملفات الموجودة:
- `pmi.svg`
- `cisco.svg`
- `ruijie.svg`
- `legrand.svg`
- `dahua.svg`

## 2) صور الشهادات
ضع صور الشهادات الأصلية داخل:

`assets/img/certificates/`

واستخدم الأسماء التالية، أو عدل المسارات داخل `assets/js/certifications.js`:
- `pmp-certificate.jpg`
- `ccna-certificate.jpg`
- `rcna-certificate.jpg`
- `lcs3-certificate.jpg`
- `dahua-ipvs-certificate.jpg`
- `dahua-acs-certificate.jpg`

النسخة الحالية تحتوي صورًا تجريبية مؤقتة. استبدل كل صورة بالصورة الأصلية بنفس الاسم.

## 3) ملف بيانات الشهادات
جميع أسماء الشهادات والجهة والسنة ومسارات اللوجو والصورة موجودة في:

`assets/js/certifications.js`

يمكن تعديل أي شهادة من هذا الملف فقط دون لمس HTML.

## 4) HTML
تم تحويل شبكة الشهادات إلى عنصر ديناميكي:

```html
<div id="certification-grid" class="certification-grid reveal" aria-live="polite"></div>
```

وتمت إضافة نافذة الشهادة قبل `</body>`.

## 5) CSS وJavaScript
- تنسيق الكروت والـPopup موجود في `assets/css/style.css`.
- إنشاء الكروت وفتح/إغلاق الـPopup موجود في `assets/js/app.js`.

## ملاحظة
ملفات اللوجوهات في هذه الحزمة هي نسخ SVG مبسطة للاستخدام في التصميم. يمكن استبدالها بالأصول الرسمية المعتمدة من الشركات مع الاحتفاظ بأسماء الملفات نفسها.
