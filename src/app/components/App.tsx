import * as React from 'react';
import '../styles/ui.css';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import {selectMenu} from 'figma-plugin-ds';
import StyleOption from './style-option/style-option';
import CssOutput from './css-output/css-output';

declare function require(path: string): any;

const App = ({}) => {
    const [fontStyles, setFontStyles] = React.useState(null);
    const [fontFamilies, setFontFamilies] = React.useState(null);
    const [colorStyles, setColorStyles] = React.useState(null);
    const [effectStyles, setEffectStyles] = React.useState(null);
    const [stylesLoaded, setStylesLoaded] = React.useState(false);

    const onGenerateStyles = () => {
        parent.postMessage({pluginMessage: {type: 'generate-styles'}}, '*');
    };

    const fontUnitOptions = ['px', 'rem'];
    const colorUnitOptions = ['rgba', 'hsla', 'hex'];

    const fontBaseSizes = [10, 11, 12, 13, 14, 15, 16, 17, 18];

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const {type, message, fonts, fontFamilies, fontStyles, colors, effects} = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            } else if (type === 'generate-styles') {
                setFontStyles(fontStyles);
                setFontFamilies(fontFamilies);

                setColorStyles(colors);
                setEffectStyles(effects);

                setStylesLoaded(true);
            }
        };

        //initialize all select menus
        selectMenu.init();
    }, []);

    return (
        <div className="content">
            {/* <h2 className='type--small type--medium'>Generate CSS Custom Properties</h2> */}
            <div className="options-list">
                <StyleOption
                    type={'font-styles'}
                    label={'Font Styles'}
                    units={fontUnitOptions}
                    size={fontBaseSizes}
                ></StyleOption>
                <StyleOption type={'color-styles'} label={'Color Styles'} units={colorUnitOptions}></StyleOption>
                {/* <StyleOption type={"effect-styles"} label={"Effect Styles"}></StyleOption> */}
                <button className="button button--primary" onClick={onGenerateStyles}>
                    Copy to Clipboard
                </button>
            </div>
            {stylesLoaded && (
                <CssOutput
                    fontFamilies={fontFamilies}
                    fontStyles={fontStyles}
                    colors={colorStyles}
                    effects={effectStyles}
                />
            )}
        </div>
    );
};

export default App;
