import bcrypt from "bcryptjs";

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash("Usertest", salt);

export default [
    {
        name: "company",
        values: {
            name: "Test company",
            url: "test-company",
            type: 0,
        },
    },
    {
        name: "user",
        values: {
            name: "Usertest",
            password: hashedPassword,
            url: "usertest",
            theme: 0,
            company_id: 1,
        },
    },
    {
        name: "role",
        values: {
            name: "super_admin",
        },
    },
    {
        name: "user_role",
        values: {
            user_id: 1,
            role_id: 1,
        },
    },
];
