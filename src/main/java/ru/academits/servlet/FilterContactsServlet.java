package ru.academits.servlet;

import ru.academits.PhoneBook;
import ru.academits.converter.ContactConverter;
import ru.academits.model.Contact;
import ru.academits.service.ContactService;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

public class FilterContactsServlet extends HttpServlet {
    private ContactService phoneBookService = PhoneBook.phoneBookService;
    private ContactConverter contactConverter = PhoneBook.contactConverter;

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        try {
            String searchText = req.getParameter("searchText");
            List<Contact> contactList = phoneBookService.getFilteredContacts(searchText);

            GetAllContactsServlet.sendJSON(resp, contactList, contactConverter);
        } catch (Exception e) {
            System.out.println("error in FilterContactsServlet GET: ");
            e.printStackTrace();
        }
    }
}