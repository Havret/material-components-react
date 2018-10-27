module.exports = {
    title: 'Material Components for React',
    components: 'src/**/*.tsx',
    ignore: ['**/*.test.tsx', '**/*.test.ts'],
    propsParser: require('react-docgen-typescript').withDefaultConfig({propFilter: {skipPropsWithoutDoc: true}}).parse,
    require: [
        './docs/styles.css',
        '@material/button/dist/mdc.button.css',
        '@material/ripple/dist/mdc.ripple.css',
        '@material/checkbox/dist/mdc.checkbox.css',
        '@material/fab/dist/mdc.fab.css',
        '@material/elevation/dist/mdc.elevation.css'
    ],
    template: {
        head: {
            links: [{
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500'
            }, {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
            }]
        }
    },
    styleguideDir: './docs'
};