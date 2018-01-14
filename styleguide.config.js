module.exports = {
    title: 'Material Components for React',
    components: 'src/**/*.tsx',
    ignore: ['**/*.test.tsx', '**/*.test.ts'],
    propsParser: require('react-docgen-typescript').withDefaultConfig().parse,
    template: './styleguide/index.html',
    require: [
        './styleguide/styles.css',
        '@material/button/dist/mdc.button.css'
    ]
};