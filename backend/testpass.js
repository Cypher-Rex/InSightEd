import bcrypt from "bcryptjs";

const hashPassword = async (plainTextPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    console.log("Hashed Password:", hashedPassword);
};

hashPassword("admin123");
hashPassword("user123");
