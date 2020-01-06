'use strict'

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '//contact-world-api.herokuapp.com/contact', //'http://localhost:3000/contact'
        dataType: 'json',
        success: function (res) {
            const contacts = res.Data;
            if (!Array.isArray(contacts) || !contacts) {
                $('#contacts-list').html(`
                    <tr class="text-center">
                        <th scope="row" colspan="4"><h1>${contacts}</h1></th>
                    </tr>
                `);
            } else {
                $.each(contacts, function (i, contact) {
                    $('#contacts-list').append(`
                        <tr>
                            <th scope="row">${i + 1}</th>
                            <td>${contact.name}</td>
                            <td>${contact.phone}</td>
                            <td>${contact.email}</td>
                            <td>
                                <button type="button" class="btn btn-warning" title="Edit Contact" data-toggle="modal" data-target="#editDeleteModal" onclick="getContact(${contact.id}, 1)"><i class="far fa-edit"></i></button>
                                <button type="button" class="btn btn-danger" title="Delete Contact" data-toggle="modal" data-target="#editDeleteModal" onclick="getContact(${contact.id}, 0)"><i class="far fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    `);
                });
            }
        }
    });

    // inisialisasi kondisi modal
    $('#editDeleteModal').on('hidden.bs.modal', function (e) {
        $('.modal-title').html('');
        $('#deleteAlert').hide();
        $('#btn-submit').removeAttr('onclick');
        $('#btn-submit').html('');
        $('#btn-submit').removeClass('btn-warning');
        $('#btn-submit').removeClass('btn-danger');
        $('#modal-name').removeAttr('disabled','');
        $('#modal-phone').removeAttr('disabled','');
        $('#modal-email').removeAttr('disabled','');
    });
});

function addContact() {
    const form = $('#formAdd').serialize();
    $.ajax({
        url: '//contact-world-api.herokuapp.com/contact/add', //'http://localhost:3000/contact/add'
        type: 'POST',
        data: form
    })
        .done(success => {
            location.reload();
        })
        .fail(err => {
            console.log(err);
        })
}

function editContact(id) {
    const form = $('#formEditDelete').serialize();
    $.ajax({
        url: '//contact-world-api.herokuapp.com/\contact/edit/' + id, //'http://localhost:3000/contact/edit/' + id
        type: 'POST',
        data: form
    })
        .done(success => {
            location.reload();
        })
        .fail(err => {
            console.log(err);
        })
}

function deleteContact(id) {
    const form = $('#formEditDelete').serialize();
    $.ajax({
        url: '//contact-world-api.herokuapp.com/contact/delete/' + id, //'http://localhost:3000/contact/delete/' + id
        type: 'GET'
    })
        .done(success => {
            location.reload();
        })
        .fail(err => {
            console.log(err);
        })
}

function getContact(id, isEdit) {
    $.ajax({
        url: '//contact-world-api.herokuapp.com/contact/' + id, //'http://localhost:3000/contact/' + id
        type: 'GET',
        dataType: 'json',
        success: result => {
            const contact = result.Data;
            if (result.status === 200) {
                if (isEdit) {
                    $('.modal-title').html('Edit Contact');
                    $('#btn-submit').attr('onclick', 'editContact('+ id +')');
                    $('#btn-submit').html('Save Changes');
                    $('#btn-submit').addClass('btn-warning');
                } else {
                    $('.modal-title').html('Delete Contact');
                    $('#deleteAlert').show();
                    $('#btn-submit').attr('onclick', 'deleteContact('+ id +')');
                    $('#btn-submit').html('Delete Contact');
                    $('#btn-submit').addClass('btn-danger');
                    $('#modal-name').attr('disabled','');
                    $('#modal-phone').attr('disabled','');
                    $('#modal-email').attr('disabled','');
                }

                $('#modal-name').val(contact.name);
                $('#modal-phone').val(contact.phone);
                $('#modal-email').val(contact.email);
            } else {
                $('#editDeleteModal .modal-body').html(`
                    <div class="alert alert-danger" role="alert">
                        Something went wrong with API. Try again later.
                    </div>
                `);
            }
        }
    })
}