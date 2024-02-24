exports.up = function (db, callback) {
  const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT,
        first_name VARCHAR(255) NOT NULL,
        middle_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        deleted_at DATETIME,
        PRIMARY KEY(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


    `;

  const sql2 = `
    CREATE TABLE IF NOT EXISTS invoice (
      id INT UNSIGNED AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL,
      invoice_tag VARCHAR(255) NOT NULL UNIQUE,
      bill_from_street_address VARCHAR(255) NOT NULL,
      bill_from_city VARCHAR(255) NOT NULL,
      bill_from_post_code VARCHAR(255) NOT NULL,
      bill_from_country VARCHAR(255) NOT NULL,
      bill_to_client_name VARCHAR(255) NOT NULL,
      bill_to_client_email VARCHAR(255) NOT NULL,
      bill_to_street_address VARCHAR(255) NOT NULL,
      bill_to_city VARCHAR(255) NOT NULL,
      bill_to_post_code VARCHAR(255) NOT NULL,
      bill_to_country VARCHAR(255) NOT NULL,
      invoice_date DATE NOT NULL,
      payment_terms VARCHAR(255) NOT NULL,
      project_description VARCHAR(255) NOT NULL,
      total INT NOT NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      deleted_at DATETIME,
      PRIMARY KEY(id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

  const sql3 = `
    CREATE TABLE IF NOT EXISTS invoice_item (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      invoice_id INT UNSIGNED NOT NULL,
      item_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price INT NOT NULL,
      total INT NOT NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      deleted_at DATETIME,
      FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; 
    `;

  db.runSql(sql, [], callback);
  db.runSql(sql2, [], callback);
  db.runSql(sql3, [], callback);
};

exports.down = function (db, callback) {
  const sql = `
      DROP TABLE IF EXISTS invoice_item;
  `;
  const sql2 = `
      DROP TABLE IF EXISTS invoice;
  `;

  const sql3 = `
      DROP TABLE IF EXISTS users;
    `;

  db.runSql(sql, [], callback);
  db.runSql(sql2, [], callback);
  db.runSql(sql3, [], callback);
};
