-- Create a new table 'TableName' with a primary key and columns
CREATE TABLE Produkt (
    id SERIAL PRIMARY KEY,
    navn text not null,
    beskrivelse text not null,
    pris float not null,
    bilde text not null
);