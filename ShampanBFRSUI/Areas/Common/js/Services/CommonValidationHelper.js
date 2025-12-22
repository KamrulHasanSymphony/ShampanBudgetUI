var CommonValidationHelper = (function () {


    function CheckValidation(formSelector) {
        var $form = $(formSelector);
        var validator = $form.validate();
        var model = serializeInputs($form.attr("id"));
        var isFormValid = true;

        function isEmpty(value) {
            return value === "" || value === null || value === undefined;
        }

        var commonMessage = "This field is required.";

        // Loop all fields with class "required"
        $form.find(".required").each(function () {
            var $field = $(this);
            var fieldId = $field.attr("id");
            if (!fieldId) return;

            // Bind dynamic clearing event
            bindClearEvent($field);

            // Check value
            if (isEmpty(model[fieldId])) {
                markInvalid($field, commonMessage);
                isFormValid = false;
            }
        });

        if (!isFormValid) return false;

        // jQuery validator check
        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return false;
        }

        return true;
    }

    //function bindClearEvent($field) {
    //    var widget = $field.data("kendoMultiColumnComboBox");
    //    if (widget) {
    //        widget.unbind("change.checkvalidation").bind("change.checkvalidation", function () {
    //            if (widget.value()) clearInvalid($field);
    //        });
    //    } else {
    //        $field.off("input.checkvalidation change.checkvalidation")
    //            .on("input.checkvalidation change.checkvalidation", function () {
    //                if ($field.val().trim() !== "") clearInvalid($field);
    //            });
    //    }
    //}
    function bindClearEvent($field) {
        var widget = $field.data("kendoMultiColumnComboBox");
        if (widget) {
            widget.bind("change", function () {
                if (widget.value()) clearInvalid($field);
            });
        } else {
            $field.off("input.checkvalidation change.checkvalidation")
                .on("input.checkvalidation change.checkvalidation", function () {
                    if ($field.val().trim() !== "") clearInvalid($field);
                });
        }
    }

    function validateForm(formSelector, rules) {
        var isFormValid = true;
        function isEmpty(value) {
            return value === "" || value === null || value === undefined;
        }

        // Clear previous errors
        rules.forEach(function (r) {
            clearInvalid(r.selector);
        });

        // Validate each rule
        rules.forEach(function (r) {
            var widget = $(r.selector).data("kendoMultiColumnComboBox");
            var value;
            if (widget) {
                value = widget.value();
                if (!value || value === "") {
                    value = widget.text();
                }
            } else {
                value = $(r.selector).val();
            }

            if (!value || value.trim() === "") {
                markInvalid(r.selector, r.message);
                isFormValid = false;
            }
        });

        if (!isFormValid) return false;

        // Bind dynamic clearing generically
        rules.forEach(function (r) {
            bindClearEvent(r.selector);
        });

        return true;
    }

    function bindClearEvent(selector) {
        var widget = $(selector).data("kendoMultiColumnComboBox");
        if (widget) {
            // Kendo ComboBox: use change event
            ////widget.unbind("change").bind("change", function () {
            ////    clearInvalid(selector);
            ////});
            widget.bind("change", function () {
                clearInvalid(selector);
            });
        } else {
            // Normal inputs: input or change events
            $(selector).off("input change").on("input change", function () {
                clearInvalid(selector);
            });
        }
    }
    function markInvalid(selector, message) {
        var widget = $(selector).data("kendoMultiColumnComboBox");
        if (widget) {
            widget.wrapper.addClass("k-invalid");
            widget._inputWrapper.addClass("k-state-invalid");
        } else {
            $(selector).addClass("input-validation-error");
        }
        $(selector).closest(".input-group").siblings("span.text-danger").text(message).show();
        isFormValid = false;
    }

    function clearInvalid(selector) {
        var widget = $(selector).data("kendoMultiColumnComboBox");
        if (widget) {
            widget.wrapper.removeClass("k-invalid");
            widget._inputWrapper.removeClass("k-state-invalid");
        } else {
            $(selector).removeClass("input-validation-error");
        }
        $(selector).closest(".input-group").siblings("span.text-danger").text("").hide();
    }

    return {
        CheckValidation: CheckValidation,
        validateForm: validateForm,
        clearInvalid: clearInvalid,
        markInvalid: markInvalid
    };

})();
