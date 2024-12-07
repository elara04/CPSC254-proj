CREATE TABLE Employee (
    cwid CHAR(4) PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    office VARCHAR(50)
);

CREATE TABLE Course (
    section_number INTEGER PRIMARY KEY,
    inst_id CHAR(4) REFERENCES Employee(cwid),
    deptcode VARCHAR(10) NOT NULL,
    capacity INTEGER NOT NULL,
    enrolled INTEGER,
    room VARCHAR(50),
    time VARCHAR(50)
);

CREATE TYPE category_type AS ENUM ('PC', 'Equipment', 'Monitor');

CREATE TABLE Asset (
    asset_id INTEGER PRIMARY KEY,
    category category_type NOT NULL,
    purchase_year INTEGER,
    manufacture VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    model VARCHAR(50),
    location VARCHAR(100),
    service_tag VARCHAR(30) 
);
