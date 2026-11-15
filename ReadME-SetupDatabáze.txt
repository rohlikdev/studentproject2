Kroky pro setup PostgreSQL databáze

1. Jít do PostgreSQL aplikace pgAdmin 4
2. Vytvořit novou databázi se jménem "rezervace_db"
3. Pravým tlačítkem kliknout na nově vytvořenou databázi a kliknout na "Backup..."
4. Nastavit format na "Plain"
5. Kliknout na procházení souborů u "Filename"
6. Vybrat "All files" dole u prohlížeče souborů
7. Vybrat databázi "rezervace"
8. Kliknout na modré tlačítko "Backup" v pravo dole
9. Hotovo

(pro zobrazení dat z databáze si otevřete "rezervace_db" -> "Schemas" -> "Tables" -> "reservations" / "rooms" (Pravým tlačítkem na View/Edit data -> All Rows)


-----------------------------------

Užitečné informace:

user: 'postgres',
host: 'localhost',
database: 'rezervace_db',
port: 5432,