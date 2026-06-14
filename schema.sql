CREATE TABLE pilgrimages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tirthankar_name VARCHAR(100),
    tirthankar_number INT,
    tirthankar_symbol VARCHAR(50),
    temple_name VARCHAR(255),
    history_importance TEXT,
    why_it_is_famous TEXT,
    location VARCHAR(255),
    address TEXT,
    how_to_reach TEXT,
    facilities_available TEXT,
    nearby_jain_dharmshala TEXT,
    nearby_stay TEXT
);

CREATE TABLE nearby_historical_places (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pilgrimage_id INT,
    place_name VARCHAR(255),
    location VARCHAR(255),
    distance VARCHAR(50),
    description TEXT,
    FOREIGN KEY (pilgrimage_id) REFERENCES pilgrimages(id)
);

CREATE TABLE nearby_jain_temples (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pilgrimage_id INT,
    temple_name VARCHAR(255),
    location VARCHAR(255),
    distance VARCHAR(50),
    sect VARCHAR(50),
    description TEXT,
    FOREIGN KEY (pilgrimage_id) REFERENCES pilgrimages(id)
);