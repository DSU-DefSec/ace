# DSU CCDC Ansible Collection

Designed for CCDC by DSU

[![Ansible Lint](https://github.com/dsiemienas03/ccdc-ansible/actions/workflows/ansible_lint.yml/badge.svg)](https://github.com/dsiemienas03/ccdc-ansible/actions/workflows/ansible_lint.yml)

## Roles

- `dsu.ccdc.cisco` _In Progress_
- `dsu.ccdc.esxi`
- `dsu.ccdc.palo`
- `dsu.ccdc.pfsense` _In Progress_
- `dsu.ccdc.proxmox` _In Progress_
- `dsu.ccdc.wasabi_wall`

## Playbooks

### Cisco

  <!-- - `dsu.ccdc.cisco. -->

### ESXI
Playbook | Description
--- | ---
`dsu.ccdc.esxi.full_palo` | Flip all NICs 
`dsu.ccdc.esxi.prefw` | Adds all the NICs and gets the VMs
`dsu.ccdc.esxi.updatenics` | Flip all NICs to specified network or defaults to `lan`
`dsu.ccdc.esxi.snapshot` | Takes snapshots of all VMs on the host
`dsu.ccdc.esxi.vswitch` | Create vSwitch and updates Palo NICs

### Palo
Playbook | Description
--- | ---
`dsu.ccdc.palo.dynamicupdate`| Runs dynamic updates
`dsu.ccdc.palo.get_rules` | Pulls rules off of the firewall
`dsu.ccdc.palo.init` | Does an initial config
`dsu.ccdc.palo.os_update` | Runs OS updates
`dsu.ccdc.palo.reinit` | Reinitializes the firewall `config` vars set to false
`dsu.ccdc.palo.rerule` | Runs all the rules again
`dsu.ccdc.palo.rules` | Runs only service rules

### pfSense
