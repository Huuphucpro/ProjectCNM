import path from 'path'
import multer from 'multer'

export const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        // Log file information for debugging
        console.log("Uploading file:", {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });
        
        let ext = path.extname(file.originalname).toLowerCase();
        console.log("File extension:", ext);

        // Check both extension and mimetype
        const validExtensions = [".jpg", ".jpeg", ".png"];
        const validMimetypes = ["image/jpeg", "image/jpg", "image/png"];
        
        if (!validExtensions.includes(ext) && !validMimetypes.includes(file.mimetype)) {
            console.error("File rejected: Invalid type/extension", { ext, mimetype: file.mimetype });
            cb(new Error("File type is not supported. Please upload a JPG, JPEG, or PNG image."));
            return;
        }
        
        console.log("File accepted");
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB size limit
    }
})