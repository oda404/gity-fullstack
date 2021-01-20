'use strict'

const isFieldValid = (field) => {
    const sField = field?.toString();
    return !(sField === undefined || sField.match(/^ *$/) || sField === "");
}

exports.isFieldValid = isFieldValid;
