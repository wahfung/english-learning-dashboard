import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: "#c21d03",
                    200: "#fd5732",
                    300: "#ffb787",
                },
                accent: {
                    100: "#393939",
                    200: "#bebebe",
                },
                text: {
                    100: "#232121",
                    200: "#4b4848",
                },
                bg: {
                    100: "#fbfbfb",
                    200: "#f1f1f1",
                    300: "#c8c8c8",
                },
            },
            boxShadow: {
                card: "0 4px 20px rgba(0, 0, 0, 0.08)",
                "card-hover": "0 8px 30px rgba(0, 0, 0, 0.12)",
            },
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
        },
    },
    plugins: [],
};

export default config;
