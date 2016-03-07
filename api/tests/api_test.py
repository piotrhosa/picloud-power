import unittest
import api_run
import requests

class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        api_run.create_run('test_data')

if __name__ == '__main__':
    unittest.main()
