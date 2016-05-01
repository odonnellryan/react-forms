'use strict';

import React from "react"

var isValid = function () {
    var errors = [];
    if (this.props.validator) {
        if (this.props.validator(this.state.value)) {
            this.setState({errors: errors});
            return true;
        } else {
            this.setState({errors: errors.concat(this.props.errorMessage)});
            return false;
        }
    }
    return true;
};

var handleChange = function (e) {
    var data = e.target.value;
    this.setState({value: data},
        () => {
            this.isValid();
            this.updateParent();
        }
    );
};

var checkboxChange = function (e) {
    var data = e.target.checked;
    this.setState({value: data},
        () => {
            this.isValid();
            this.updateParent();
        }
    );
};

var updateParent = function () {
    // parent shouldn't ever have to receive our errors.
    // after update, we want to clean the error messages anyway
    if (this.props.onChange) {
        var state = {errors: [], value: this.state.value};
        this.props.onChange(state, this.props.name);
    }
};

var Input = React.createClass({

    getInitialState() {
        return {
            value: this.props.value || '',
            errors: []
        };
    },

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    },

    isValid: isValid,

    updateParent: updateParent,
    handleChange: handleChange,
    checkboxChange: checkboxChange,

    render() {
        var errors;
        if (this.props.errors) {
            errors = this.state.errors.concat(this.props.errors);
        } else {
            errors = this.state.errors;
        }
        return (
            <div className="form-group">
                {errors.map(function (error) {
                    return <span key={error} className="form-error"> {error} </span>;
                })}
                <label htmlFor={this.props.name} className="control-label">{this.props.label}</label>
                <input onChange={this.handleChange}
                       className="form-control"
                       type={this.props.type}
                       required={this.props.required}
                       name={this.props.name}
                       id={this.props.name}
                       placeholder={this.props.placeholder}
                       value={this.state.value}
                       min={this.props.min}
                       max={this.props.max}
                       step={this.props.step}
                       pattern={this.props.pattern}
                />
            </div>
        )
    }
});


class NumberInput extends Input {

    render() {
        var errors = [];
        if (this.props.errors) {
            errors = this.state.errors.concat(this.props.errors);
        } else {
            errors = this.state.errors;
        }
        return (
            <div className="form-group">
                {errors.map(function (error) {
                    return <div key={error} className="form-error"> {error} </div>;
                })}
                <label htmlFor={this.props.name} className="control-label">{this.props.label}</label>
                <input onChange={this.handleChange}
                       className="form-control stepper-input"
                       type="number"
                       required={this.props.required}
                       name={this.props.name}
                       id={this.props.name}
                       placeholder={this.props.placeholder}
                       value={this.state.value}
                       min={this.props.min}
                       max={this.props.max}
                       step={this.props.step}
                       pattern={this.props.pattern}
                />
            </div>
        )
    }
}

class Slider extends Input {

    render() {
        var errors = [];
        if (this.props.errors) {
            errors = this.state.errors.concat(this.props.errors);
        } else {
            errors = this.state.errors;
        }
        return (
            <div className="form-group">
                {errors.map(function (error) {
                    return <div key={error} className="form-error"> {error} </div>;
                })}
                <label htmlFor={this.props.name} className="control-label">{this.props.label}</label>
                <input onChange={this.handleChange}
                       className="form-control stepper-input"
                       type="range"
                       required={this.props.required}
                       name={this.props.name}
                       id={this.props.name}
                       placeholder={this.props.placeholder}
                       value={this.state.value}
                       min={this.props.min}
                       max={this.props.max}
                       step={this.props.step}
                       pattern={this.props.pattern}
                />
            </div>
        )
    }
}


var Select = React.createClass({

    getInitialState() {
        return {
            value: this.props.value || '',
            options: this.props.options || [],
            errors: []
        };
    },

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    },

    isValid() {
        // we shouldn't need validators for select fields.
        // if the field is there, you can select it.
        // if not, remove or disable the field
        return true;
    },

    updateParent: updateParent,

    handleChange: handleChange,

    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.props.name} className="control-label">{this.props.label}</label>
                <select onChange={this.handleChange} id={this.props.name} ref={this.props.name} value={this.state.value}
                        name={this.props.name} className="form-control">
                    {this.props.options.map(function (option) {
                        return <option key={option.value} value={option.value}>{option.name}</option>;
                    })}
                </select>
            </div>
        )
    }
});


class CheckBox extends Input {
    render() {
        return (
            <div className="custom-checkbox">
                <input id={this.props.name} ref={this.props.name} onChange={this.checkboxChange}
                       name={this.props.name} value={this.state.value} checked={this.state.value} type="checkbox"/>
                <label htmlFor={this.props.name} >
                    {this.props.label}
                </label>
            </div>
        )
    }
}

class Date extends Input {
    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <input id={this.props.name} ref={this.props.name} onChange={this.handleChange} name={this.props.name}
                       value={this.state.value} type="date" className="form-control"/>
            </div>
        )
    }
}

class Search extends Input {
    render() {
        return (
            <div className="form-search search-only">
                <i className="search-icon glyphicon glyphicon-search">&nbsp;</i>
                <input id={this.props.name} ref={this.props.name} onChange={this.handleChange} name={this.props.name}
                       value={this.state.value} type="text" className="form-control search-query"
                       placeholder={this.props.placeholder}/>
            </div>
        )
    }
}

var handleSubmit = function (callback) {
    return () => {
        var canSubmit = [];
        Object.keys(this.refs).map((field) => {
            try {
                canSubmit.push(this.refs[field].isValid());
                // if we're trying to call isValid on a ref that doesn't have this method.
            } catch (TypeError) {
            }
        });
        if (canSubmit.every(Boolean)) {
            callback(this.state);
        } else {
        }
    }
};

var requiredValidator = function (data) {
    return !!data;
};

module.exports = {
    Input: Input, Select: Select, CheckBox: CheckBox, NumberInput: NumberInput, Slider: Slider,
    Date: Date, handleSubmit: handleSubmit, requiredValidator: requiredValidator, Search: Search
};