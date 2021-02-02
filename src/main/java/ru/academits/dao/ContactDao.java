package ru.academits.dao;

import ru.academits.model.Contact;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by Anna on 17.06.2017.
 */
public class ContactDao {
    private List<Contact> contactList = new ArrayList<>();
    private AtomicInteger idSequence = new AtomicInteger(-1);

    public ContactDao() {
        Contact contact = new Contact();
        contact.setId(getNewId());
        contact.setFirstName("Иван");
        contact.setLastName("Иванов");
        contact.setPhone("9123456789");
        contactList.add(contact);
    }

    private int getNewId() {
        return idSequence.addAndGet(1);
    }

    public List<Contact> getAllContacts() {
        return contactList;
    }

    public void add(Contact contact) {
        contact.setId(getNewId());
        contactList.add(contact);
    }

    public void del(int ID) {
        for (int i = 0; i < contactList.size(); ++i) {
            if (contactList.get(i).getId() == ID) {
                contactList.remove(i);
                break;
            }
        }
    }

    public List<Contact> filterContacts(String searchText) {
        List<Contact> filteredList = new ArrayList<>();
        for (Contact contact : contactList) {
            if (contact.getFirstName().toLowerCase().contains(searchText.toLowerCase())) {
                filteredList.add(contact);
                continue;
            }

            if (contact.getLastName().toLowerCase().contains(searchText.toLowerCase())) {
                filteredList.add(contact);
                continue;
            }

            if (contact.getPhone().toLowerCase().contains(searchText.toLowerCase())) {
                filteredList.add(contact);
            }
        }
        return filteredList;
    }
}