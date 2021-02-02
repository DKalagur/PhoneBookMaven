package ru.academits.servlet;

import ru.academits.PhoneBook;
import ru.academits.converter.ContactConverter;
import ru.academits.model.Contact;
import ru.academits.service.ContactService;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

public class GetAllContactsServlet extends HttpServlet {
    private ContactService phoneBookService = PhoneBook.phoneBookService;
    private ContactConverter contactConverter = PhoneBook.contactConverter;

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        try {
            List<Contact> contactList = phoneBookService.getAllContacts();

            sendJSON(resp, contactList, contactConverter);
        } catch (Exception e) {
            System.out.println("error in GetAllContactsServlet GET: ");
            e.printStackTrace();
        }
    }

    static void sendJSON(HttpServletResponse resp, List<Contact> contactList, ContactConverter contactConverter) throws IOException {
        String contactListJson = contactConverter.convertToJson(contactList);
        resp.getOutputStream().write(contactListJson.getBytes(Charset.forName("UTF-8")));
        resp.getOutputStream().flush();
        resp.getOutputStream().close();
    }
}