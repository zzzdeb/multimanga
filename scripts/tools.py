#!/usr/bin/env python
import json
import os
from os.path import join
from os import listdir


class DataBase:

    """Docstring for DataBase. """

    def __init__(self):
        """TODO: to be defined. """
        self.langs = []
        self.names = []
        self.chapters = {}

    def create_template(self, lang_list, namelist=[], chapters=[]):
        LANGLEN = len(lang_list)
        data = {}
        #  data['lang_order'] = lang_list
        #  if len(namelist) == 0:
        #  data['name'] = ['name_'+i for i in lang_list]
        #  else:
        #  data['name'] = namelist
        #  if len(chapters)==0:
        #  data['chapter'] =
        #  else:
        #  data['chapters']

        return data

    def add_lang(self, lang, name=''):
        self.langs.append(lang)
        if name == '':
            name = lang+'_name'
        self.names.append(name)

    def load_from_file(self, path):
        with open(path, 'r') as f:
            data = json.load(f)
            self.langs = data['lang_order']
            self.names = data['name']
            self.chapters = data['chapters']

    def dump_as_file(self, path):
        with open(path, 'w') as f:
            data = {}
            data['lang_order'] = self.langs
            data['name'] = self.names
            data['chapters'] = self.chapters
            json.dump(data, f)

    def add_chapter_from_filesystem(self, path, begins='Chapter'):
        for chapter in listdir(path):
            self.add_chapter(chapter)
            chap_path = join(path, chapter)
            for lang in listdir(chap_path):
                lang_path = join(chap_path, lang)
                for i, page in enumerate(sorted(listdir(lang_path))):
                    page_path = join(lang_path, page)
                    self.chapters[chapter][i][self.get_lang_key(lang)] = page_path

    def add_chapter(self, chapter):
        self.chapters[chapter] = {}


    def get_lang_key(self, lang):
        for i, l in enumerate(self.langs):
            if lang == l:
                return i
        raise KeyError

db = DataBase()
db.add_chapter_from_filesystem('/home/zzz/projects/multimanga/data/Dr Stone')
