# Introduction

## Linux Structure

Linux is an operating system used on personal computers, servers, embedded systems, and mobile devices. It is a key pillar of cybersecurity due to its robustness, flexibility, and open-source nature. This section introduces the Linux structure, architecture, philosophy, and file system, which are essential concepts for cybersecurity professionals.

Like Windows or macOS, Linux is an operating system that manages hardware resources and enables communication between software and hardware. Unlike other operating systems, Linux exists in many different distributions (“distros”), each designed for specific needs and use cases.


### History

Linux originated from Unix, developed in the 1970s by Ken Thompson and Dennis Ritchie. Later projects such as BSD and GNU, led by Richard Stallman, promoted the idea of free and open-source software through the GNU General Public License, but lacked a widely adopted free kernel.

In 1991, Linus Torvalds created the Linux kernel, which evolved into the foundation of hundreds of Linux distributions. Today, there are over 600 Linux distributions, including Ubuntu, Debian, Fedora, and Red Hat.

Linux is known for its stability, security, and high performance. It is less vulnerable to malware than many other operating systems and is frequently updated. Being free and open-source, Linux can be modified and distributed freely and is used on servers, desktops, embedded devices, and mobile platforms. Android is also based on the Linux kernel, making Linux the most widely deployed operating system worldwide.

For hands-on labs, Parrot OS will be used—a Debian-based Linux distribution focused on security, privacy, and development.


### Philosophy

- Simplicity
- Modularity
- Openness

It advocates for building small, single-purpose programs that perform one task well. 
| Principles | Description |
| ---------- | ----------- |
| Everithing is a file | All configuration files for the various services running on the Linux operating system are stored in one or more text files. |
| Small, single-purpose programs | Linux offers many different tools that we will work with, which can be combined to work together. |
| Ability to chain programs together to perform complex tasks | The integration and combination of different tools enable us to carry out many large and complex tasks, such as processing or filtering specific data results. |
| Avoid captive user interface | Linux is designed to work mainly with the shell (or terminal), which gives the user greater control over the operating system. |
| Configuration data stored in a text file | An example of such a file is the **/etc/passwd file**, which stores all users registered on the system. |


### Components

| Components |  Description |
| ---------  | ------------ |
| Bootloader | A piece of code that runs to guide the booting process to start the operating system. Parrot Linux uses the GRUB Bootloader. |
| OS Kernel | The kernel is the main component of an operating system. It manages the resources for system's I/O devices at the hardware level. |
| Deamons | Background services are called "daemons" in Linux. Their purpose is to ensure that key functions such as scheduling, printing, and multimedia are working correctly. These small programs load after we booted or log into the computer.|
| OS Shell | The operating system shell or the command language interpreter (also known as the command line) is the interface between the OS and the user. This interface allows the user to tell the OS what to do. The most commonly used shells are Bash, Tcsh/Csh, Ksh, Zsh, and Fish. |
| Graphics Server | This provides a graphical sub-system (server) called "X" or "X-server" that allows graphical programs to run locally or remotely on the X-windowing system.|
| Window Manager | Also known as a graphical user interface (GUI). There are many options, including GNOME, KDE, MATE, Unity, and Cinnamon. A desktop environment usually has several applications, including file and web browsers. These allow the user to access and manage the essential and frequently accessed features and services of an operating system.|
| Utilities | Applications or utilities are programs that perform particular functions for the user or another program.|


### Linux Architecture

| Layer | Description |
| ----- | ----------- |
| Hardware | Peripheral devices such as the system's RAM, hard drive, CPU, and others. |
| Kernel | The core of the Linux operating system whose function is to virtualize and control common computer hardware resources like CPU, allocated memory, accessed data, and others. The kernel gives each process its own virtual resources and prevents/mitigates conflicts between different processes.|
| Shell | A command-line interface (CLI), also known as a shell that a user can enter commands into to execute the kernel's functions.|
| System Utilities | Makes available to the user all of the operating system's functionality.|

### File System Hierarchy

The Linux operating system is structured in a tree-like hierarchy and is documented in the [Filesystem Hierarchy Standard](https://www.pathname.com/fhs/) (FHS). 

| Path | Description |
| ---- | ----------- |
| / |   The top-level directory is the **root filesystem** and contains all of the files required to boot the operating system before other filesystems are mounted, as well as the files required to boot the other filesystems. After boot, all of the other filesystems are mounted at standard mount points as subdirectories of the root.|
| /bin | Containes essential command binaries.|
| /boot | Consists of the static **bootloader**, kernel executable, and files required to boot the Linux OS.|
| /dev | Contains **device** files to facilitate access to every hardware device attached to the system. |
| /etc| Local system **configuration** files. Configuration files for installed applications may be saved here as well.|
| /home|Each user on the system has a subdirectory here for storage.|
| /lib| Shared library files that are required for system boot.|
| /media | External removable media devices such as USB drives are mounted here.|
| /mnt | Temporary mount point for regular filesystems.|
| /opt | **Optional files** such as third-party tools can be saved here.|
| /root| The home directory of the root user.|
| /sbin| This directory contains executables used for **system administration** (binary system files).|
| /tmp| The operating system and many programs use this directory to **store temporary files**. This directory is generally cleared upon system boot and may be deleted at other times without any warning.|
| /usr| Contains executables, libraries, man files, etc.|
| /var| This directory contains variable data files such as log files, email in-boxes, web application related files, cron files, and more.|

## Linux Distribution

Linux distributions - or distros - are operating systems based on the Linux kernel. Each Linux distribution is different, with its own set of features, packages, and tools. Some popular examples include:
- Ubuntu
- Fedora
- CentOS
- Debian
- Red Hat Enterprise Linux

## Introduction to Shell

A Linux terminal, also called a `shell` or command line, provides a text-based input/output (I/O) interface between users and the kernel for a computer system. 
We can think of a shell as a text-based GUI in which we enter commands to perform actions like navigating to other directories, working with files, and obtaining information from the system but with way more capabilities.

### Terminal Emulators

Terminal emulation is software that emulates the function of a terminal. It allows the use of text-based programs within a `graphical user interface (GUI)`. There are also so-called `command-line interfaces (CLI)` that run as additional terminals in one terminal. In short, a terminal serves as an interface to the shell interpreter.

Additionally, `command-line interfaces (CLI)` that run as additional terminals within one terminal are like having multiple virtual receptionist desks open on your screen simultaneously. Each one allows you to send different instructions to the server room independently, but through the same main interface. 

Terminal emulators and multiplexers are beneficial extensions for the terminal ([Tmux](https://github.com/tmux/tmux/wiki)).



### Shell

The most commonly used shell in Linux is the `Bourne-Again Shell (BASH)`, and is part of the GNU project. Besides Bash, there also exist other shells like Tcsh/Csh, Ksh, Zsh, Fish shell and others.




