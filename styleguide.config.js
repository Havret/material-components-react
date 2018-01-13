module.exports = {
    title: 'Material Components for React',
    components: 'src/**/*.tsx',
    propsParser: require('react-docgen-typescript').withDefaultConfig().parse,
    template: './styleguide/index.html',
    require: [
        '@material/button/dist/mdc.button.css'
    ]
};