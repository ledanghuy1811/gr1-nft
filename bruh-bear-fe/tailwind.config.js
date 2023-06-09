/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                'primary-color': '#50c9ff'
            },
            // fontFamily: {
            //     'primary-font': ['Termina', 'sans-serif'],
            // },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false, // <== disable this!
    }
};
