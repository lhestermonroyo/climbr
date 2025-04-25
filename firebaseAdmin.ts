import admin from 'firebase-admin';

import { firebaseAdmin } from './config';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebaseAdmin.project_id,
    clientEmail: firebaseAdmin.client_email,
    privateKey: firebaseAdmin.private_key.replace(/\\n/g, '\n')
    // type: firebaseAdmin.type,
    // project_id: firebaseAdmin.project_id,
    // private_key_id: firebaseAdmin.private_key_id,
    // private_key: firebaseAdmin.private_key.replace(/\\n/g, '\n'),
    // client_email: firebaseAdmin.client_email,
    // client_id: firebaseAdmin.client_id,
    // auth_uri: firebaseAdmin.auth_uri,
    // token_uri: firebaseAdmin.token_uri,
    // auth_provider_x509_cert_url: firebaseAdmin.auth_provider_x509_cert_url,
    // client_x509_cert_url: firebaseAdmin.client_x509_cert_url,
    // universe_domain: firebaseAdmin.universe_domain
  })
});

export default admin;
