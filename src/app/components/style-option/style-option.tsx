import * as React from 'react';
import './style-option.css';

export default function StyleOption(props) {
    const [toggleState, setToggleState] = React.useState(true);

    return (
        <div className="style-option">
            <div className="style-option_header">
                <div className="style-option_toggle toggle">
                    <input
                        id={`${props.type}-toggle`}
                        type="checkbox"
                        className="switch__toggle"
                        defaultChecked={toggleState}
                        onChange={() => setToggleState(!toggleState)}
                    />
                    <label htmlFor={`${props.type}-toggle`} className="switch__label">
                        {props.label}
                    </label>
                </div>

                {props.units && (
                    <select id="unit_select" className="select-menu style-option_select">
                        {props.units.map((unit, index) => {
                            return (
                                <option key={`unit-option-${index}`} value={unit}>
                                    {unit}
                                </option>
                            );
                        })}
                    </select>
                )}

                {props.size && (
                    <select id="size_select" className="select-menu style-option_select">
                        {props.size.map((size, index) => {
                            return (
                                <option key={`size-option-${index}`} value={size}>
                                    {size}px
                                </option>
                            );
                        })}
                    </select>
                )}
            </div>

            {toggleState && <div className="style-option_drawer">{props.children}</div>}
        </div>
    );
}
