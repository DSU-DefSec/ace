import hashlib
import re
import sys
from subprocess import Popen, PIPE


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <new password> [db password]")

    new_password = sys.argv[1]
    db_password = ""

    hash_patterns = {
        "MD5": r"'[a-fA-F0-9]{32}'",
        "SHA1": r"'[a-fA-F0-9]{40}'",
        "SHA256": r"'[a-fA-F0-9]{64}'",
        "PHPMD5": r"'\$P\$[0-9a-zA-Z.\/]{31}'",
        "SHA512": r"'[a-fA-F0-9]{128}'",
        "DES": r"'[a-z0-9\/.]{12}[.26AEIMQUYcgkosw]{1}'",
        "HALFMD5": r"'[a-f0-9]{16}'",
        "PRESTASHOP": r"'[a-f0-9]{32}:[a-z0-9]{56}'",
        "MD2": r"'(\$md2\$)?[a-f0-9]{32}$'",
        "MD5CRYPT": r"'\$1\$[a-z0-9\/.]{0,8}\$[a-z0-9\/.]{22}(:.*)?'",
        "PHPBB": r"'\$H\$[a-z0-9\/.]{31}'",
        "PALSHOP": r"'[a-f0-9]{51}'",
        "BCRYPT": r"'(\$2[abxy]?|\$2)\$[0-9]{2}\$[a-zA-Z0-9\/.]{53}'",
        "YESCRYPT": r"'\$y\$[.\/A-Za-z0-9]+\$[.\/a-zA-Z0-9]+\$[.\/A-Za-z0-9]{43}'",
        "JOOMLA": r"'[a-f0-9]{32}:[a-z0-9]{32}'",
        "PBKDF-HMAC-SHA512": r"'\$ml\$[0-9]+\$[a-f0-9]{64}\$[a-f0-9]{128}'",
        "DJANGO": r"'sha256\$[a-z0-9]+\$[a-f0-9]{64}'",
        "MEDIAWIKI": r"'[:\$][AB][:\$]([a-f0-9]{1,8}[:\$])?[a-f0-9]{32}'",
        "Hmailserver": r"'[a-f0-9]{70}'",
        "PHPS": r"'\$PHPS\$.+\$[a-f0-9]{32}'",
    }

    replacement_counts = {}

    for key in hash_patterns.keys():
        replacement_counts[key] = 0

    # export database
    sqldump_cmd = ["mysqldump"]
    if len(sys.argv) == 3:
        sqldump_cmd.append("-p")
        sqldump_cmd.append(db_password := sys.argv[2])

    sqldump_cmd.append("--all-databases")

    # open result as fd
    with Popen(sqldump_cmd, stdout=PIPE, text=True) as db_raw:
        db = db_raw.stdout.read()

        # compile regexes
        hash_regexes = {}
        for hash_type, pattern in hash_patterns.items():
            regex = re.compile(pattern)
            hash_regexes[hash_type] = regex

        # iterate regexes
        for hash_type, regex in hash_regexes.items():
            new_hash = ""

            # generate hashes
            # TODO: add the rest
            match hash_type:
                case "MD5":
                    hash_obj = hashlib.md5()
                    hash_obj.update(new_password.encode())
                    new_hash += hash_obj.hexdigest()
                case "SHA1":
                    hash_obj = hashlib.sha1()
                    hash_obj.update(new_password.encode())
                    new_hash += hash_obj.hexdigest()
                case "SHA256":
                    hash_obj = hashlib.sha256()
                    hash_obj.update(new_password.encode())
                    new_hash += hash_obj.hexdigest()
                case "SHA512":
                    hash_obj = hashlib.sha512()
                    hash_obj.update(new_password.encode())
                    new_hash += hash_obj.hexdigest()
                case "HALFMD5":
                    hash_obj = hashlib.md5()
                    hash_obj.update(new_password.encode())
                    new_hash += hash_obj.hexdigest()[:16]

            new_hash += "'"

            # replace hashes
            (db, replacement_count) = regex.subn(new_hash, db)
            replacement_counts[hash_type] += replacement_count

        # import updated db
        import_cmd = ["mysql"]
        if db_password:
            import_cmd.append("-p")
            import_cmd.append(db_password)

        Popen(import_cmd, stdin=PIPE, text=True).communicate(db)

    # report
    for hash_type, count in replacement_counts.items():
        if count > 0:
            print(f"Replaced {count} {hash_type} hashes")


if __name__ == "__main__":
    main()
