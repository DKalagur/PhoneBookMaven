function Contact(firstName, lastName, phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.checked = false;
    this.shown = true;
}

new Vue({
    el: "#app",
    data: {
        validation: false,
        serverValidation: false,
        firstName: "",
        lastName: "",
        phone: "",
        rows: [],
        serverError: "",
        selectAll: false,
        searchText: ""
    },
    methods: {
        contactToString: function (contact) {
            var note = "(";
            note += contact.firstName + ", ";
            note += contact.lastName + ", ";
            note += contact.phone;
            note += ")";
            return note;
        },
        convertContactList: function (contactListFromServer) {
            return contactListFromServer.map(function (contact, i) {
                return {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phone: contact.phone,
                    checked: false,
                    shown: true,
                    number: i + 1
                };
            });
        },
        addContact: function () {
            if (this.hasError) {
                this.validation = true;
                this.serverValidation = false;
                return;
            }

            var self = this;

            var contact = new Contact(this.firstName, this.lastName, this.phone);
            $.ajax({
                type: "POST",
                url: "/phonebook/add",
                data: JSON.stringify(contact)
            }).done(function () {
                self.serverValidation = false;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = true;
            }).always(function () {
                self.loadData();
            });

            self.firstName = "";
            self.lastName = "";
            self.phone = "";
            self.validation = false;
        },
        loadData: function () {
            var self = this;

            $.get("/phonebook/get/all").done(function (response) {
                var contactListFormServer = JSON.parse(response);
                self.rows = self.convertContactList(contactListFormServer);
            });

            self.searchText = ""; //TODO переместить на нужное место
        },
        checkForDelContact: function (contact) {
            contact.checked = true;
        },
        delContact: function (contact) {
            var IDContactsForDel = [contact.id];
            this.delData(IDContactsForDel);
        },
        delCheckedContacts: function () {
            var IDContactsForDel = _.pluck(_.filter(this.rows, function (e) {
                return e.checked === true;
            }), 'id');

            this.delData(IDContactsForDel);
            this.selectAll = false;
        },
        delData: function (IDContactsForDel) {
            var self = this;

            $.ajax({
                type: "POST",
                url: "/phonebook/del",
                data: JSON.stringify(IDContactsForDel)
            }).done(function () {
                self.serverValidation = false;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = true;
            }).always(function () {
                if (self.searchText === "") {
                    self.loadData();
                } else {
                    self.searchItem();
                }
            });
        },
        pickAllItems: function (event) {
            var self = this;

            if (event) {
                self.rows.forEach(function (e) {
                    e.checked = true;
                });
            } else {
                self.rows.forEach(function (e) {
                    e.checked = false;
                });
            }
        },
        searchItem: function () {
            var self = this;
            if (this.searchText === "") {
                this.loadData();
            } else {
                $.ajax({
                    type: "GET",
                    url: "/phonebook/search",
                    data: {searchText: self.searchText}
                }).done(function (response) {
                    var contactListFormServer = JSON.parse(response);
                    self.rows = self.convertContactList(contactListFormServer);
                });
            }
        },
        cancelSearch: function () {
            this.searchText = "";
            this.loadData();
        }
    },
    computed:
        {
            firstNameError: function () {
                if (this.firstName) {
                    return {
                        message: "",
                        error: false
                    };
                }

                return {
                    message: "Поле Имя должно быть заполнено.",
                    error: true
                };
            }
            ,
            lastNameError: function () {
                if (!this.lastName) {
                    return {
                        message: "Поле Фамилия должно быть заполнено.",
                        error: true
                    };
                }

                return {
                    message: "",
                    error: false
                };
            }
            ,
            phoneError: function () {
                if (!this.phone) {
                    return {
                        message: "Поле Телефон должно быть заполнено.",
                        error: true
                    };
                }

                var self = this;

                var sameContact = this.rows.some(function (c) {
                    return c.phone === self.phone;
                });

                if (sameContact) {
                    return {
                        message: "Номер телефона не должен дублировать другие номера в телефонной книге.",
                        error: true
                    };
                }

                return {
                    message: "",
                    error: false
                };
            }
            ,
            hasError: function () {
                return this.lastNameError.error || this.firstNameError.error || this.phoneError.error;
            }
        }
    ,
    created: function () {
        this.loadData();
    }
});
