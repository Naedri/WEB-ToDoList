const utils = require("../db/utils");


module.exports = {
    getAll,
    getById,
    save,
    update,
    deleteById
  };
 

  function getAll(sortBy, callback) {
    const query = 
    `SELECT  l.id, l.username, t.id, t.titre, t.echeance, t.note, t.fait, st.id, st.titre, st.fait
    FROM liste l, tache t, soustache st
    WHERE l.id=t.id AND t.id=st.id;`;
    utils.executeQuery(query, [], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, result.rows);
      }
    });
  }