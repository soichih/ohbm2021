#!/usr/bin/env node
const config = require('./config');
const admin = require('firebase-admin');
const fs = require('fs');
const async = require('async');
const {exec} = require('child_process');
const path = require('path');
const faker = require('faker');
const utils = require('./utils');

const pdfkit = require('pdfkit');

admin.initializeApp(config.firebase);

const venue = "mainauditorium";
const venue_name = "Main Auditorium";

//const venue = "livestage";
//const venue_name = "Live Stage";

async function insert() {
    const db = admin.firestore();

    const occupied_pos = await utils.occupied(venue, venue_name);

    for(let i = 0;i < 100;++i) {
        const id = "fake."+parseInt(Math.random()*100000);

        //pick spot that's visible
        let pos = null;
        while(true) {
            pos = utils.findpos();
            if(pos.column >= -8 && pos.column <= 8 && pos.row >= -5 && pos.row <= 5) continue;
            let occupied = occupied_pos.find(rec=>rec.column == pos.column && rec.row == pos.row);
            if(occupied) {
                console.log(pos, "occupied already");
                continue;
            }
        
            //all good!
            break;
        }

        const user = {
            //"Please read our code of condust": true,
            //country: "United States",
            data: {
                [venue]: pos,
            },
            enteredVenueIds: [venue],
            lastSeenAt: new Date().getTime(),
            lastSeenIn: {
                [venue_name]: new Date().getTime(),
            },
            mirrorVideo: false,
            partyName: faker.name.findName()+" (fake)",
            pictureUrl: faker.internet.avatar(),
        }

        console.dir(user);
        const res = await db.collection('users').doc(id).set(user);
        console.dir(res);
   }
}
insert();
