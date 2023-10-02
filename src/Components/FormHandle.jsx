import React, { useState, useEffect } from 'react';
import 'firebase/compat/auth';
import { database } from '../firebaseConfig';
import { get, ref, push, set, update, remove } from 'firebase/database';

function FormHandle() {
    const initialUserState = {
        type: '',
        name: '',
        currency: '',
        friend: '',
        date: '',
        amount: '',
    };

    const [user, setUser] = useState(initialUserState);
    const [records, setRecords] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataRef = ref(database, 'expenses');
                const snapshot = await get(dataRef);

                if (snapshot.exists()) {
                    const data = Object.entries(snapshot.val()).map(([id, values]) => ({
                        id,
                        ...values,
                    }));
                    setRecords(data);
                }
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
            }
        };

        fetchData();
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRecord = { ...user };

        if (editIndex !== null) {
            // Edit mode
            const updatedRecords = [...records];
            updatedRecords[editIndex] = newRecord;
            setRecords(updatedRecords);
            update(ref(database, `expenses/${newRecord.id}`), newRecord)
                .then(() => {
                    console.log('Expense updated in Firebase');
                })
                .catch((error) => {
                    console.error('Error updating expense in Firebase:', error);
                });
            setEditIndex(null);
        } else {
            // Add mode
            const newRecordRef = push(ref(database, 'expenses'));
            set(newRecordRef, newRecord)
                .then(() => {
                    console.log('Expense added to Firebase');
                    setRecords([...records, { id: newRecordRef.key, ...newRecord }]);
                })
                .catch((error) => {
                    console.error('Error adding expense to Firebase:', error);
                });
        }

        setUser(initialUserState);
    };

    const editExpense = (id) => {
        const index = records.findIndex((record) => record.id === id);
        if (index !== -1) {
            setUser(records[index]);
            setEditIndex(index);
        }
    };

    const deleteExpense = (id) => {
        const index = records.findIndex((record) => record.id === id);
        if (index !== -1) {
            const expenseToDelete = records[index];
            const updatedRecords = [...records];
            updatedRecords.splice(index, 1);
            setRecords(updatedRecords);
            remove(ref(database, `expenses/${id}`))
                .then(() => {
                    console.log('Expense deleted from Firebase');
                })
                .catch((error) => {
                    console.error('Error deleting expense from Firebase:', error);
                });
            setEditIndex(null);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1 className="text-center">Simple Expense Manager Project</h1>
                <div className="row bg-secondary row p-3">
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label>Type</label>
                            <select
                                name="type"
                                className="form-control"
                                value={user.type}
                                onChange={handleInput}
                            >
                                <option> --choose one</option>
                                <option value="Cash"> CASH </option>
                                <option value="Upi"> UPI</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={user.name}
                                onChange={handleInput}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Currency</label>
                            <select
                                name="currency"
                                className="form-control"
                                value={user.currency}
                                onChange={handleInput}
                            >
                                <option> --choose one</option>
                                <option value="USD"> USD </option>
                                <option value="RS"> RS </option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label>Add Friend </label>
                            <input
                                type="text"
                                name="friend"
                                className="form-control"
                                value={user.friend}
                                onChange={handleInput}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                value={user.date}
                                onChange={handleInput}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Amount</label>
                            <input
                                type="number"
                                name="amount"
                                className="form-control"
                                value={user.amount}
                                onChange={handleInput}
                            />
                        </div>
                    </div>


                </div>
                <div className="text-center">
                    <button className="btn btn-primary mt-1 " type="submit">
                        {editIndex !== null ? 'Update an Expense' : 'Add A New Expense'}

                    </button>
                </div>
            </form>

            <div className="bg-light container-fluid mt-4">
                <table className="table table-bordered table-hover text-center table-responsive table-responsive-sm">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Friend</th>
                            <th>Date</th>
                            <th>Currency</th>
                            <th>Amount</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id}>
                                <td>{record.type}</td>
                                <td>{record.name}</td>
                                <td>{record.friend}</td>
                                <td>{record.date}</td>
                                <td>{record.currency}</td>
                                <td>{record.amount}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => editExpense(record.id)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteExpense(record.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FormHandle;