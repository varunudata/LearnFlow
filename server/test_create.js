require('dotenv').config();
const prisma = require('./config/prisma');
const Course = require('./models/Course');

(async () => {
  try {
    const user = await prisma.user.findFirst({ where: { role: 'FACULTY' } });
    if (!user) {
      console.log("No faculty user found in DB.");
      return;
    }
    
    console.log("Testing with faculty ID:", user.id);
    const result = await Course.create(
      "Test Title", "Desc", "design", "advanced", null, user.id, 
      [{ title: "Mod1", description: "Desc1" }]
    );
    console.log("Successfully created course:", result);
  } catch (err) {
    console.error("Detailed Error:", err);
  } finally {
    await prisma.$disconnect();
  }
})();
