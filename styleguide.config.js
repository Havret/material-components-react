module.exports = {
    title: 'Material Components for React',
    components: 'src/**/*.tsx',
    ignore: ['**/*.test.tsx', '**/*.test.ts'],
    propsParser: require('react-docgen-typescript').withDefaultConfig().parse,
    template: './docs/index.html',
    require: [
        './docs/styles.css',
        '@material/button/dist/mdc.button.css',
        '@material/ripple/dist/mdc.ripple.css'
    ],
    styleguideDir: './docs'
};