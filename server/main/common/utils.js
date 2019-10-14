// const bcrypt = require('bcrypt'); // Use bcryptjs for Windows, bcrypt for Linux
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

exports.sendEmail = (toEmail, subject, html) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: toEmail,
    from: 'noreply@mernsaas.com',
    subject,
    text: 'Notification!',
    html: html,
  };
  sgMail.send(msg);
  console.log(subject + " email sent to " + toEmail)
}
/**
 * Hash encrypt a clear string
 *
 * @param {string}   clearString The string to hash
 * @param {function} callback (err, data)
                     The function that is called after the async call
                     error {object}: null if no error
                     data {object}: The data set of a succesful call
 */
exports.hash = (clearString, callback) => {
  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return callback(saltError); }

    return bcrypt.hash(clearString, salt, (hashError, hash) => {
      if (hashError) { return callback(hashError); }

      return callback(null, hash);
    });
  });
};

/**
 * Check if clear string matches the bycrpt hash
 */
exports.compareHash = (hash, clearString, callback) => {
  bcrypt.compare(hash, clearString, callback);
};
