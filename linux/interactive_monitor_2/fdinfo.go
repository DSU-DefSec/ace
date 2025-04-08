package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
)

type FDInfo struct {
	pos    uint64
	flags  uint64
	mnt_id uint64
	ino    uint64
}

func (f FDInfo) String() string {
	return fmt.Sprintf("%d:%d@%d (%d)", f.ino, f.mnt_id, f.pos, f.flags)
}

func readFDInfo(pid int) (map[int]FDInfo, error) {
	posRE := regexp.MustCompile(`pos:\s+([0-9]+)`)
	flagsRE := regexp.MustCompile(`flags:\s+([0-7]+)`)
	mnt_idRE := regexp.MustCompile(`mnt_id:\s+([0-9]+)`)
	inoRE := regexp.MustCompile(`ino:\s+([0-9a-fA-F]+)`)

	path := fmt.Sprintf("/proc/%d/fdinfo", pid)
	fdEntries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	ret := make(map[int]FDInfo, len(fdEntries))
	for _, fdEntry := range fdEntries {
		fd, err := strconv.Atoi(fdEntry.Name())
		if err != nil {
			continue
		}
		data, err := os.ReadFile(fmt.Sprintf("%s/%d", path, fd))
		if err != nil {
			return ret, err
		}

		posMatch := posRE.FindSubmatch(data)
		flagsMatch := flagsRE.FindSubmatch(data)
		mnt_idMatch := mnt_idRE.FindSubmatch(data)
		inoMatch := inoRE.FindSubmatch(data)

		pos, _ := strconv.ParseUint(string(posMatch[1]), 10, 64)
		flags, _ := strconv.ParseUint(string(flagsMatch[1]), 8, 64)
		mnt_id, _ := strconv.ParseUint(string(mnt_idMatch[1]), 10, 64)
		ino, _ := strconv.ParseUint(string(inoMatch[1]), 10, 64)

		ret[fd] = FDInfo{
			pos:    pos,
			flags:  flags,
			mnt_id: mnt_id,
			ino:    ino,
		}
	}

	return ret, nil
}
