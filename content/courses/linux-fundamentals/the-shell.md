# The Shell

## Prompt Description

The home directory for a user is marked with a tilde <~> and is the default folder when we log in.
```
<username>@<hostname>[~]$
```
The dollar sign, in this case, stands for a user. As soon as we log in as root, the character changes to a hash <#> and looks like this:
```
root@htb[/htb]#
```
- Unprivileged (User): `$`
- Privileged (Root): `#`

The `PS1` variable in Linux systems controls how your command prompt looks in the terminal.
Using tools like `script` or reviewing the `.bash_history file` (located in the user's home directory), you can record all the commands you've used and organize them by date and time, which aids in documentation and analysis.

The prompt can be customized using special characters and variables in the shell’s configuration file (`.bashrc` for the Bash shell). For example, we can use: the `\u` character to represent the current username, `\h` for the hostname, and `\w` for the current working directory.