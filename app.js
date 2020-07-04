const user=document.querySelector('#user-list');
const form=document.querySelector('#add-user-form');
const update_form=document.querySelector('#update-user-form');


function renderuser(doc){
    let li=document.createElement('li');
    let firstname=document.createElement('span');
    let lastname=document.createElement('span');
    let identity=document.createElement('span');
    let cross=document.createElement('h2');

    li.setAttribute('data-id',doc.id);

    firstname.textContent=doc.data().firstname;
    lastname.textContent=doc.data().lastname;
    identity.textContent= "  (" + doc.id + ")";
    cross.textContent='x';

    li.appendChild(firstname);
    li.appendChild(lastname);
    li.appendChild(identity);
    li.appendChild(cross);

    user.appendChild(li);

    cross.addEventListener('click', (e) => {
        let id=e.target.parentElement.getAttribute('data-id');
        db.collection('users').doc(id).delete();
        //setTimeout(function(){ location.reload(); }, 2000);
        
        
    })
}

//getting data
/*db.collection('users').where('college','==','MMMUT').orderBy('lastname').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderuser(doc);
    });
});
*/


//adding data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('users').add({
        firstname: form.firstname.value,
        lastname: form.lastname.value
    });
    form.firstname.value='';
    form.lastname.value='';
    //setTimeout(function(){ location.reload(); }, 3000);
});

//Updating user info
update_form.addEventListener('submit',(e) => {
    e.preventDefault();
    db.collection('users').doc(update_form.idselect.value).update({
        firstname: update_form.fnupdate.value,
        lastname: update_form.lnupdate.value
    })
    update_form.idselect.value='';
    update_form.fnupdate.value='';
    update_form.lnupdate.value='';
})


//Real-time changes
db.collection('users').orderBy('firstname').onSnapshot(snapshot => {
    let changes=snapshot.docChanges();
    //console.log(changes);
    changes.forEach(change => {
        if(change.type == 'added'){
            renderuser(change.doc);
        }
        else if(change.type == 'removed'){
            let li=user.querySelector('[data-id=' + change.doc.id + ']');
            user.removeChild(li);
        }
        else if(change.type == 'modified'){
            let li=user.querySelector('[data-id=' + change.doc.id + ']');
            user.removeChild(li);
            renderuser(change.doc);
        }
    });
});