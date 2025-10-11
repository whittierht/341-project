import { useEffect, useState } from "react";
import { getAll, createOne, updateOne, deleteOne } from "./api";
import "./index.css";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [openId, setOpenId] = useState(null); 
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    favoriteColor: "",
    birthday: "",
  });

  useEffect(() => {
    getAll()
      .then((data) => setContacts(data || []))
      .catch((err) => {
        console.log("Failed to load contacts", err);
        alert("Could not load contacts.");
      })
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setNewContact({
      firstName: "",
      lastName: "",
      email: "",
      favoriteColor: "",
      birthday: "",
    });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!newContact.firstName || !newContact.lastName || !newContact.email) {
      alert("Please fill out first name, last name, and email.");
      return;
    }

    try {
      if (editingId) {
        await updateOne(editingId, newContact);
        setContacts((prev) =>
          prev.map((c) => (c._id === editingId ? { ...c, ...newContact, _id: editingId } : c))
        );
        resetForm();
      } else {
        const created = await createOne(newContact);
        const id = created?.id;
        setContacts((prev) => [...prev, { ...newContact, _id: id }]);
        resetForm();
      }
    } catch (err) {
      console.log("Save failed", err);
      alert("Save failed. Try again.");
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this contact?");
    if (!ok) return;

    try {
      await deleteOne(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (editingId === id) resetForm();
      if (openId === id) setOpenId(null);
    } catch (err) {
      console.log("Delete failed", err);
      alert("Delete failed. Try again.");
    }
  }

  function startEdit(c) {
    setEditingId(c._id);
    setNewContact({
      firstName: c.firstName || "",
      lastName: c.lastName || "",
      email: c.email || "",
      favoriteColor: c.favoriteColor || "",
      birthday: c.birthday || "",
    });
    window.scrollTo(0, 0);
  }

  function toggleDetails(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="shell">
      <header className="header">
        <div>
          <h1 className="title">Contacts</h1>
        </div>
      </header>

      <section className="panel">
        <h2 className="panel__title">{editingId ? "Edit contact" : "Add a new contact"}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="First name"
            value={newContact.firstName}
            onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Last name"
            value={newContact.lastName}
            onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Favorite color"
            value={newContact.favoriteColor}
            onChange={(e) => setNewContact({ ...newContact, favoriteColor: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Birthday"
            type="date"
            value={newContact.birthday}
            onChange={(e) => setNewContact({ ...newContact, birthday: e.target.value })}
            required
          />

          <div className="actions">
            <button className="btn btn--primary" type="submit">
              {editingId ? "Save changes" : "Add Contact"}
            </button>
            {editingId ? (
              <button className="btn" type="button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="list-section">
        <div className="list-header">
          <h2>All Contacts {loading ? "…" : ""}</h2>
        </div>

        {loading ? (
          <div className="empty">Loading contacts…</div>
        ) : contacts.length === 0 ? (
          <div className="empty">No contacts yet — add one above.</div>
        ) : (
          <ul className="cards">
            {contacts.map((c) => {
              const first = c.firstName ? c.firstName[0].toUpperCase() : "";
              const last = c.lastName ? c.lastName[0].toUpperCase() : "";

              const isOpen = openId === c._id;

              return (
                <li key={c._id} className="card">
                  <div className="card__main">
                    <div className="avatar" aria-hidden="true">
                      {first}
                      {last}
                    </div>
                    <div className="text">
                      <div className="name">
                        <strong>
                          {c.firstName} {c.lastName}
                        </strong>
                      </div>
                      <div className="meta">
                        <span className="badge">{c.favoriteColor}</span>
                        <span className="dot">•</span>
                        <span>{c.email}</span>
                        <span className="dot">•</span>
                        <span>{c.birthday}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card__actions">
                    <button className="btn" onClick={() => toggleDetails(c._id)}>
                      {isOpen ? "Hide" : "Details"}
                    </button>
                    <button className="btn" onClick={() => startEdit(c)}>
                      Edit
                    </button>
                    <button className="btn btn--danger" onClick={() => handleDelete(c._id)}>
                      Delete
                    </button>
                  </div>

                  {isOpen && (
                    <div className="details" role="region" aria-label="Contact details">
                      <div><b>First:</b> {c.firstName}</div>
                      <div><b>Last:</b> {c.lastName}</div>
                      <div><b>Email:</b> {c.email}</div>
                      <div><b>Favorite color:</b> {c.favoriteColor}</div>
                      <div><b>Birthday:</b> {c.birthday}</div>
                      <div><b>Id:</b> {c._id}</div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
