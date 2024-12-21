export const getDate = (type: "min" | "max"): string => {
    const date = new Date();
    const year: string = String(date.getFullYear() + (type === "min" ? 0 : 5));
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const day: string = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
