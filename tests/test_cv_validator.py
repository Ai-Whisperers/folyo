#!/usr/bin/env python3
"""
Comprehensive tests for CV Validator
Tests the accuracy and reliability of the CV data validation function.
"""

import os
import sys
import unittest
import tempfile
import yaml
from typing import Dict, Any

# Add parent directory to path to import our validator
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from utils.cv_validator import CVValidator, validate_cv_file

class TestCVValidator(unittest.TestCase):
    """Comprehensive test suite for CVValidator class."""

    def setUp(self):
        """Set up test fixtures before each test method."""
        self.validator = CVValidator()
        self.valid_cv_data = {
            'theme_skin': 'berry',
            'sidebar': {
                'position': 'right',
                'about': False,
                'education': False,
                'name': 'John Doe',
                'tagline': 'Software Developer',
                'email': 'john.doe@email.com',
                'phone': '+1 234 567 8900'
            },
            'interests': {
                'title': 'Interests',
                'info': [
                    {'item': 'Programming'},
                    {'item': 'Technology'}
                ]
            },
            'career-profile': {
                'title': 'Career Profile',
                'summary': 'Experienced developer with expertise in multiple technologies.'
            },
            'education': {
                'title': 'Education',
                'info': [
                    {
                        'degree': 'Bachelor of Computer Science',
                        'university': 'Tech University',
                        'time': '2018 - 2022'
                    }
                ]
            },
            'experiences': {
                'title': 'Experiences',
                'info': [
                    {
                        'role': 'Software Developer',
                        'time': '2022 - Present',
                        'company': 'Tech Corp',
                        'details': 'Developed web applications'
                    }
                ]
            },
            'skills': {
                'title': 'Skills & Proficiency',
                'toolset': [
                    {
                        'name': 'Python',
                        'level': '90%',
                        'tags': ['Programming', 'Backend']
                    },
                    {
                        'name': 'JavaScript',
                        'level': '85%',
                        'tags': ['Programming', 'Frontend']
                    }
                ]
            }
        }

    def tearDown(self):
        """Clean up after each test method."""
        pass

    def create_temp_yaml_file(self, data: Dict[str, Any]) -> str:
        """Helper method to create temporary YAML file for testing."""
        temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.yml', delete=False)
        yaml.dump(data, temp_file, default_flow_style=False, allow_unicode=True)
        temp_file.close()
        return temp_file.name

    def test_valid_cv_data_passes_validation(self):
        """Test that a valid CV data structure passes all validations."""
        temp_file = self.create_temp_yaml_file(self.valid_cv_data)
        try:
            is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
            self.assertTrue(is_valid, f"Valid CV should pass validation. Errors: {errors}")
            self.assertEqual(len(errors), 0, "Valid CV should have no errors")
        finally:
            os.unlink(temp_file)

    def test_missing_required_sections_fail_validation(self):
        """Test that missing required sections cause validation to fail."""
        test_cases = [
            ('theme_skin', 'theme_skin is required'),
            ('sidebar', 'Missing required section: sidebar'),
            ('experiences', 'Missing required section: experiences'),
            ('education', 'Missing required section: education'),
            ('skills', 'Missing required section: skills')
        ]
        
        for section_to_remove, expected_error_substring in test_cases:
            with self.subTest(section=section_to_remove):
                data = self.valid_cv_data.copy()
                del data[section_to_remove]
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertFalse(is_valid, f"CV missing {section_to_remove} should fail validation")
                    self.assertTrue(any(expected_error_substring in error for error in errors),
                                  f"Expected error containing '{expected_error_substring}' not found in: {errors}")
                finally:
                    os.unlink(temp_file)

    def test_invalid_theme_skin_fails_validation(self):
        """Test that invalid theme skin causes validation to fail."""
        data = self.valid_cv_data.copy()
        data['theme_skin'] = 'invalid_theme'
        
        temp_file = self.create_temp_yaml_file(data)
        try:
            is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
            self.assertFalse(is_valid, "Invalid theme skin should fail validation")
            self.assertTrue(any('Invalid theme_skin' in error for error in errors),
                          f"Expected theme_skin error not found in: {errors}")
        finally:
            os.unlink(temp_file)

    def test_valid_theme_skins_pass_validation(self):
        """Test that all valid theme skins pass validation."""
        valid_themes = ['blue', 'turquoise', 'green', 'berry', 'orange', 'ceramic', 'teal', 'oceanstale']
        
        for theme in valid_themes:
            with self.subTest(theme=theme):
                data = self.valid_cv_data.copy()
                data['theme_skin'] = theme
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Valid theme '{theme}' should pass validation. Errors: {errors}")
                finally:
                    os.unlink(temp_file)

    def test_invalid_sidebar_position_fails_validation(self):
        """Test that invalid sidebar position causes validation to fail."""
        data = self.valid_cv_data.copy()
        data['sidebar']['position'] = 'invalid_position'
        
        temp_file = self.create_temp_yaml_file(data)
        try:
            is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
            self.assertFalse(is_valid, "Invalid sidebar position should fail validation")
            self.assertTrue(any('Invalid sidebar position' in error for error in errors),
                          f"Expected sidebar position error not found in: {errors}")
        finally:
            os.unlink(temp_file)

    def test_email_validation_accuracy(self):
        """Test email validation accuracy with various formats."""
        valid_emails = [
            'test@example.com',
            'user.name@domain.org',
            'first+last@company.co.uk',
            'numbers123@test.io'
        ]
        
        invalid_emails = [
            'invalid-email',
            '@domain.com',
            'user@',
            'user@domain',
            'user name@domain.com'
        ]
        
        # Empty email should be treated as optional (no validation required)
        optional_emails = ['', '   ', None]
        
        # Test valid emails
        for email in valid_emails:
            with self.subTest(email=email):
                data = self.valid_cv_data.copy()
                data['sidebar']['email'] = email
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Valid email '{email}' should pass validation. Errors: {errors}")
                finally:
                    os.unlink(temp_file)
        
        # Test invalid emails
        for email in invalid_emails:
            with self.subTest(email=email):
                data = self.valid_cv_data.copy()
                data['sidebar']['email'] = email
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertFalse(is_valid, f"Invalid email '{email}' should fail validation")
                    self.assertTrue(any('Invalid email format' in error for error in errors),
                                  f"Expected email error not found for '{email}' in: {errors}")
                finally:
                    os.unlink(temp_file)
        
        # Test optional emails (should be valid - empty fields are optional)
        for email in optional_emails:
            with self.subTest(email=email):
                data = self.valid_cv_data.copy()
                data['sidebar']['email'] = email
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Optional email '{email}' should be valid. Errors: {errors}")
                finally:
                    os.unlink(temp_file)

    def test_skill_level_validation_accuracy(self):
        """Test skill level validation with various formats."""
        valid_levels = ['0%', '50%', '100%', '75%', '90%', '50', '85', 75]
        invalid_levels = ['150%', '-10%', 'invalid', 'expert', '200']
        
        # Test valid levels
        for level in valid_levels:
            with self.subTest(level=level):
                data = self.valid_cv_data.copy()
                data['skills']['toolset'][0]['level'] = level
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Valid skill level '{level}' should pass validation. Errors: {errors}")
                finally:
                    os.unlink(temp_file)
        
        # Test invalid levels
        for level in invalid_levels:
            with self.subTest(level=level):
                data = self.valid_cv_data.copy()
                data['skills']['toolset'][0]['level'] = level
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertFalse(is_valid, f"Invalid skill level '{level}' should fail validation")
                    skill_errors = [e for e in errors if 'level' in e.lower()]
                    self.assertTrue(len(skill_errors) > 0, f"Expected skill level error for '{level}' not found in: {errors}")
                finally:
                    os.unlink(temp_file)

    def test_experience_required_fields_validation(self):
        """Test that missing required fields in experiences cause validation to fail."""
        required_fields = ['role', 'time', 'company']
        
        for field in required_fields:
            with self.subTest(field=field):
                data = self.valid_cv_data.copy()
                del data['experiences']['info'][0][field]
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertFalse(is_valid, f"Missing {field} in experience should fail validation")
                    self.assertTrue(any(f'missing required field: {field}' in error for error in errors),
                                  f"Expected error for missing '{field}' not found in: {errors}")
                finally:
                    os.unlink(temp_file)

    def test_education_required_fields_validation(self):
        """Test that missing required fields in education cause validation to fail."""
        required_fields = ['degree', 'university']
        
        for field in required_fields:
            with self.subTest(field=field):
                data = self.valid_cv_data.copy()
                del data['education']['info'][0][field]
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertFalse(is_valid, f"Missing {field} in education should fail validation")
                    self.assertTrue(any(f'missing required field: {field}' in error for error in errors),
                                  f"Expected error for missing '{field}' not found in: {errors}")
                finally:
                    os.unlink(temp_file)

    def test_time_range_format_validation_accuracy(self):
        """Test time range format validation with various formats."""
        valid_time_ranges = [
            '2020 - 2024',
            '2020 - Present',
            '2020-01 - 2024-12',
            'Jan 2020 - Dec 2024',
            '2023-12 - Present'
        ]
        
        unusual_time_ranges = [
            'sometime in 2020',
            'recently',
            '2020 to 2024',
            'last year'
        ]
        
        # Test valid time ranges (should not produce warnings)
        for time_range in valid_time_ranges:
            with self.subTest(time_range=time_range):
                data = self.valid_cv_data.copy()
                data['experiences']['info'][0]['time'] = time_range
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Valid time range '{time_range}' should pass validation. Errors: {errors}")
                    time_warnings = [w for w in warnings if 'time format' in w.lower()]
                    self.assertEqual(len(time_warnings), 0, 
                                   f"Valid time range '{time_range}' should not produce warnings: {time_warnings}")
                finally:
                    os.unlink(temp_file)
        
        # Test unusual time ranges (should produce warnings but still be valid)
        for time_range in unusual_time_ranges:
            with self.subTest(time_range=time_range):
                data = self.valid_cv_data.copy()
                data['experiences']['info'][0]['time'] = time_range
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Unusual time range '{time_range}' should still be valid. Errors: {errors}")
                    time_warnings = [w for w in warnings if 'unusual time format' in w]
                    self.assertTrue(len(time_warnings) > 0, 
                                  f"Unusual time range '{time_range}' should produce warnings: {warnings}")
                finally:
                    os.unlink(temp_file)

    def test_phone_validation_accuracy(self):
        """Test phone number validation with various formats."""
        reasonable_phones = [
            '+1 234 567 8900',
            '(555) 123-4567',
            '+44 20 7123 4567',
            '555-123-4567',
            '+595 981 234 567'
        ]
        
        questionable_phones = [
            '123',  # too short
            '12345678901234567890',  # too long
            'call-me-maybe'  # not numeric
        ]
        
        # Empty phone should be treated as optional
        optional_phones = ['', '   ', None]
        
        # Test reasonable phone formats (should not produce warnings)
        for phone in reasonable_phones:
            with self.subTest(phone=phone):
                data = self.valid_cv_data.copy()
                data['sidebar']['phone'] = phone
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Reasonable phone '{phone}' should pass validation. Errors: {errors}")
                    phone_warnings = [w for w in warnings if 'phone' in w.lower()]
                    self.assertEqual(len(phone_warnings), 0, 
                                   f"Reasonable phone '{phone}' should not produce warnings: {phone_warnings}")
                finally:
                    os.unlink(temp_file)
        
        # Test questionable phone formats (should produce warnings)
        for phone in questionable_phones:
            with self.subTest(phone=phone):
                data = self.valid_cv_data.copy()
                data['sidebar']['phone'] = phone
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Questionable phone '{phone}' should still be valid. Errors: {errors}")
                    phone_warnings = [w for w in warnings if 'phone' in w.lower() and 'might be invalid' in w]
                    self.assertTrue(len(phone_warnings) > 0, 
                                  f"Questionable phone '{phone}' should produce warnings: {warnings}")
                finally:
                    os.unlink(temp_file)
        
        # Test optional phones (should be valid - empty fields are optional)
        for phone in optional_phones:
            with self.subTest(phone=phone):
                data = self.valid_cv_data.copy()
                data['sidebar']['phone'] = phone
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertTrue(is_valid, f"Optional phone '{phone}' should be valid. Errors: {errors}")
                finally:
                    os.unlink(temp_file)

    def test_file_not_found_error_handling(self):
        """Test error handling for non-existent files."""
        non_existent_file = '/path/that/does/not/exist.yml'
        is_valid, errors, warnings = self.validator.validate_cv_data(non_existent_file)
        
        self.assertFalse(is_valid, "Non-existent file should fail validation")
        self.assertTrue(any('File not found' in error for error in errors),
                       f"Expected 'File not found' error not found in: {errors}")

    def test_invalid_yaml_error_handling(self):
        """Test error handling for invalid YAML syntax."""
        invalid_yaml_content = """
        theme_skin: berry
        sidebar:
          position: right
          invalid_yaml: [unclosed list
        """
        
        temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.yml', delete=False)
        temp_file.write(invalid_yaml_content)
        temp_file.close()
        
        try:
            is_valid, errors, warnings = self.validator.validate_cv_data(temp_file.name)
            self.assertFalse(is_valid, "Invalid YAML should fail validation")
            self.assertTrue(any('YAML parsing error' in error for error in errors),
                           f"Expected YAML parsing error not found in: {errors}")
        finally:
            os.unlink(temp_file.name)

    def test_convenience_function_validate_cv_file(self):
        """Test the convenience function validate_cv_file."""
        temp_file = self.create_temp_yaml_file(self.valid_cv_data)
        try:
            # Test valid file
            result = validate_cv_file(temp_file, verbose=False)
            self.assertTrue(result, "Valid CV file should return True")
            
            # Test invalid file
            invalid_data = self.valid_cv_data.copy()
            del invalid_data['theme_skin']
            invalid_file = self.create_temp_yaml_file(invalid_data)
            
            try:
                result = validate_cv_file(invalid_file, verbose=False)
                self.assertFalse(result, "Invalid CV file should return False")
            finally:
                os.unlink(invalid_file)
        finally:
            os.unlink(temp_file)

    def test_empty_name_validation(self):
        """Test validation of empty or invalid names."""
        invalid_names = ['', '   ', None]
        
        for name in invalid_names:
            with self.subTest(name=name):
                data = self.valid_cv_data.copy()
                data['sidebar']['name'] = name
                
                temp_file = self.create_temp_yaml_file(data)
                try:
                    is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
                    self.assertFalse(is_valid, f"Empty/invalid name '{name}' should fail validation")
                    self.assertTrue(any('Name is required' in error for error in errors),
                                  f"Expected name error not found for '{name}' in: {errors}")
                finally:
                    os.unlink(temp_file)

    def test_very_long_name_warning(self):
        """Test that very long names produce warnings."""
        long_name = 'A' * 150  # 150 characters
        data = self.valid_cv_data.copy()
        data['sidebar']['name'] = long_name
        
        temp_file = self.create_temp_yaml_file(data)
        try:
            is_valid, errors, warnings = self.validator.validate_cv_data(temp_file)
            self.assertTrue(is_valid, "Long name should still be valid")
            self.assertTrue(any('unusually long' in warning for warning in warnings),
                           f"Expected long name warning not found in: {warnings}")
        finally:
            os.unlink(temp_file)

class TestCVValidatorIntegration(unittest.TestCase):
    """Integration tests using actual CV files from the project."""
    
    def setUp(self):
        """Set up paths to actual CV files."""
        self.project_root = os.path.dirname(os.path.dirname(__file__))
        self.data_dir = os.path.join(self.project_root, '_data')
        
    def test_actual_ana_cv_file_validation(self):
        """Test validation of Ana's actual CV file."""
        ana_cv_path = os.path.join(self.data_dir, 'data.yml')
        
        if os.path.exists(ana_cv_path):
            validator = CVValidator()
            is_valid, errors, warnings = validator.validate_cv_data(ana_cv_path)
            
            # Print results for debugging
            print(f"\nTesting Ana's CV: {ana_cv_path}")
            print(f"Valid: {is_valid}")
            if errors:
                print(f"Errors: {errors}")
            if warnings:
                print(f"Warnings: {warnings}")
            
            self.assertTrue(is_valid or len(errors) == 0, 
                          f"Ana's CV should be valid or have no critical errors. Errors: {errors}")
        else:
            self.skipTest(f"Ana's CV file not found at {ana_cv_path}")
    
    def test_actual_template_file_validation(self):
        """Test validation of the template file."""
        template_path = os.path.join(self.data_dir, 'data-template.yml')
        
        if os.path.exists(template_path):
            validator = CVValidator()
            is_valid, errors, warnings = validator.validate_cv_data(template_path)
            
            # Print results for debugging
            print(f"\nTesting Template CV: {template_path}")
            print(f"Valid: {is_valid}")
            if errors:
                print(f"Errors: {errors}")
            if warnings:
                print(f"Warnings: {warnings}")
            
            # Template might have placeholder values that trigger warnings, but should be structurally valid
            critical_errors = [e for e in errors if 'missing required' in e.lower() or 'invalid theme' in e.lower()]
            self.assertEqual(len(critical_errors), 0, 
                          f"Template should have no critical structural errors. Critical errors: {critical_errors}")
        else:
            self.skipTest(f"Template file not found at {template_path}")

if __name__ == '__main__':
    # Configure test output
    unittest.main(verbosity=2, buffer=True)