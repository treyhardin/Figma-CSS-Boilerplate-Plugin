import * as React from 'react';
import './css-output.css';

export default function CssOutput(props) {
    let fontFamilies = [];
    const fontFamilyTitles = ['primary', 'secondary', 'tertiary'];

    function string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
        var to = 'aaaaeeeeiiiioooouuuunc-_----';
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str
            .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    return (
        <div className="css-output">
            <pre>:root &#123;</pre>

            <code>/* Font Families */</code>
            {props.fontFamilies.map((fontFamily, index) => {
                return (
                    <code
                        key={`font-familiy_${index}`}
                    >{`--font-family_${fontFamily.name}: '${fontFamily.family}';`}</code>
                );
            })}

            {props.fontStyles.map((fontStyle, index) => {
                console.log(fontStyle);

                const fontNameSlug = string_to_slug(fontStyle.name);

                const styleOutput = <code>{`--${fontNameSlug}_font-family_child`}</code>;

                return (
                    <pre key={`font-output_${index}`}>
                        <code>{`/* ${fontStyle.name} */`}</code>
                        {fontStyle.styles && styleOutput}
                    </pre>
                );
            })}

            <code>&#125;</code>
        </div>
    );
}
