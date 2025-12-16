#!/usr/bin/env python3
"""
CV Data Validator
A utility function to validate CV YAML data structure and content accuracy.
"""

import yaml
import re
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

class CVValidator:
    """Validates CV data structure and content for accuracy."""
    
    def __init__(self):
        self.required_sections = {
            'theme_skin', 'sidebar', 'interests', 'career-profile', 
            'education', 'experiences', 'skills'
        }
        self.valid_theme_skins = {
            'blue', 'turquoise', 'green', 'berry', 'orange', 
            'ceramic', 'teal', 'oceanstale'
        }
        self.valid_sidebar_positions = {'left', 'right'}
        self.valid_skill_levels = range(0, 101)  # 0-100%
        self.errors = []
        self.warnings = []

    def validate_cv_data(self, file_path: str) -> Tuple[bool, List[str], List[str]]:
        """
        Validates CV YAML file for structural accuracy and content validity.
        
        Args:
            file_path (str): Path to the CV YAML file
            
        Returns:
            Tuple[bool, List[str], List[str]]: (is_valid, errors, warnings)
        """
        self.errors = []
        self.warnings = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = yaml.safe_load(file)
        except yaml.YAMLError as e:
            self.errors.append(f"YAML parsing error: {str(e)}")
            return False, self.errors, self.warnings
        except FileNotFoundError:
            self.errors.append(f"File not found: {file_path}")
            return False, self.errors, self.warnings
        except Exception as e:
            self.errors.append(f"File reading error: {str(e)}")
            return False, self.errors, self.warnings

        if not isinstance(data, dict):
            self.errors.append("CV data must be a dictionary/object")
            return False, self.errors, self.warnings

        # Validate required sections
        self._validate_required_sections(data)
        
        # Validate theme configuration
        self._validate_theme_config(data)
        
        # Validate sidebar configuration
        self._validate_sidebar_config(data)
        
        # Validate personal information
        self._validate_personal_info(data)
        
        # Validate experiences
        self._validate_experiences(data)
        
        # Validate education
        self._validate_education(data)
        
        # Validate skills
        self._validate_skills(data)
        
        # Validate projects (if present)
        self._validate_projects(data)
        
        is_valid = len(self.errors) == 0
        return is_valid, self.errors, self.warnings

    def _validate_required_sections(self, data: Dict[str, Any]) -> None:
        """Validate that all required sections are present."""
        missing_sections = self.required_sections - set(data.keys())
        for section in missing_sections:
            self.errors.append(f"Missing required section: {section}")

    def _validate_theme_config(self, data: Dict[str, Any]) -> None:
        """Validate theme skin configuration."""
        theme_skin = data.get('theme_skin')
        if not theme_skin:
            self.errors.append("theme_skin is required")
        elif theme_skin not in self.valid_theme_skins:
            self.errors.append(f"Invalid theme_skin '{theme_skin}'. Valid options: {', '.join(self.valid_theme_skins)}")

    def _validate_sidebar_config(self, data: Dict[str, Any]) -> None:
        """Validate sidebar configuration."""
        sidebar = data.get('sidebar', {})
        if not isinstance(sidebar, dict):
            self.errors.append("sidebar must be a dictionary")
            return
            
        position = sidebar.get('position')
        if position and position not in self.valid_sidebar_positions:
            self.errors.append(f"Invalid sidebar position '{position}'. Valid options: {', '.join(self.valid_sidebar_positions)}")

    def _validate_personal_info(self, data: Dict[str, Any]) -> None:
        """Validate personal information in sidebar."""
        sidebar = data.get('sidebar', {})
        
        # Validate name
        name = sidebar.get('name')
        if not name or not isinstance(name, str) or len(name.strip()) == 0:
            self.errors.append("Name is required and must be a non-empty string")
        elif len(name) > 100:
            self.warnings.append("Name is unusually long (>100 characters)")
            
        # Validate email format - only validate if email is provided and not empty
        email = sidebar.get('email')
        if email and isinstance(email, str) and email.strip() and not self._is_valid_email(email):
            self.errors.append(f"Invalid email format: {email}")
            
        # Validate phone format - only validate if phone is provided and not empty
        phone = sidebar.get('phone')
        if phone and isinstance(phone, str) and phone.strip() and not self._is_valid_phone(phone):
            self.warnings.append(f"Phone format might be invalid: {phone}")

    def _validate_experiences(self, data: Dict[str, Any]) -> None:
        """Validate work experiences section."""
        experiences = data.get('experiences', {})
        if not isinstance(experiences, dict):
            self.errors.append("experiences must be a dictionary")
            return
            
        info = experiences.get('info', [])
        if not isinstance(info, list):
            self.errors.append("experiences.info must be a list")
            return
            
        for i, exp in enumerate(info):
            if not isinstance(exp, dict):
                self.errors.append(f"Experience {i+1} must be a dictionary")
                continue
                
            # Validate required fields
            required_fields = ['role', 'time', 'company']
            for field in required_fields:
                if not exp.get(field):
                    self.errors.append(f"Experience {i+1} missing required field: {field}")
                    
            # Validate time format
            time_str = exp.get('time', '')
            if time_str and not self._is_valid_time_range(time_str):
                self.warnings.append(f"Experience {i+1} has unusual time format: {time_str}")

    def _validate_education(self, data: Dict[str, Any]) -> None:
        """Validate education section."""
        education = data.get('education', {})
        if not isinstance(education, dict):
            self.errors.append("education must be a dictionary")
            return
            
        info = education.get('info', [])
        if not isinstance(info, list):
            self.errors.append("education.info must be a list")
            return
            
        for i, edu in enumerate(info):
            if not isinstance(edu, dict):
                self.errors.append(f"Education {i+1} must be a dictionary")
                continue
                
            required_fields = ['degree', 'university']
            for field in required_fields:
                if not edu.get(field):
                    self.errors.append(f"Education {i+1} missing required field: {field}")

    def _validate_skills(self, data: Dict[str, Any]) -> None:
        """Validate skills section."""
        skills = data.get('skills', {})
        if not isinstance(skills, dict):
            self.errors.append("skills must be a dictionary")
            return
            
        toolset = skills.get('toolset', [])
        if not isinstance(toolset, list):
            self.errors.append("skills.toolset must be a list")
            return
            
        for i, skill in enumerate(toolset):
            if not isinstance(skill, dict):
                self.errors.append(f"Skill {i+1} must be a dictionary")
                continue
                
            # Validate skill name
            name = skill.get('name')
            if not name:
                self.errors.append(f"Skill {i+1} missing required field: name")
                
            # Validate skill level
            level_str = skill.get('level', '')
            if level_str:
                level_num = self._parse_percentage(level_str)
                if level_num is None:
                    self.errors.append(f"Skill {i+1} has invalid level format: {level_str}")
                elif level_num not in self.valid_skill_levels:
                    self.errors.append(f"Skill {i+1} level must be 0-100%: {level_str}")

    def _validate_projects(self, data: Dict[str, Any]) -> None:
        """Validate projects section if present."""
        projects = data.get('projects')
        if not projects:
            return
            
        if not isinstance(projects, dict):
            self.errors.append("projects must be a dictionary")
            return
            
        assignments = projects.get('assignments', [])
        if not isinstance(assignments, list):
            self.errors.append("projects.assignments must be a list")
            return
            
        for i, project in enumerate(assignments):
            if not isinstance(project, dict):
                self.errors.append(f"Project {i+1} must be a dictionary")
                continue
                
            if not project.get('title'):
                self.errors.append(f"Project {i+1} missing required field: title")

    def _is_valid_email(self, email: str) -> bool:
        """Check if email format is valid."""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    def _is_valid_phone(self, phone: str) -> bool:
        """Check if phone format looks reasonable."""
        # Basic check for phone number format
        cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
        return cleaned.isdigit() and 7 <= len(cleaned) <= 15

    def _is_valid_time_range(self, time_str: str) -> bool:
        """Check if time range format is reasonable."""
        patterns = [
            r'^\d{4}\s*[–-]\s*\d{4}$',  # 2020 - 2024
            r'^\d{4}\s*[–-]\s*Present$',  # 2020 - Present
            r'^[A-Za-z]+\s+\d{4}\s*[–-]\s*[A-Za-z]+\s+\d{4}$',  # Jan 2020 - Dec 2024
            r'^\d{4}-\d{2}\s*[–-]\s*\d{4}-\d{2}$',  # 2020-01 - 2024-12
            r'^\d{4}-\d{2}\s*[–-]\s*Present$'  # 2020-01 - Present
        ]
        return any(re.match(pattern, time_str.strip(), re.IGNORECASE) for pattern in patterns)

    def _parse_percentage(self, level_str: str) -> Optional[int]:
        """Parse percentage string to integer."""
        try:
            # Handle string input
            if isinstance(level_str, str):
                # Remove % sign and convert to int
                cleaned = level_str.strip().rstrip('%')
                return int(cleaned)
            # Handle numeric input
            elif isinstance(level_str, (int, float)):
                return int(level_str)
            else:
                return None
        except (ValueError, AttributeError, TypeError):
            return None

def validate_cv_file(file_path: str, verbose: bool = False) -> bool:
    """
    Convenience function to validate a CV file and print results.
    
    Args:
        file_path (str): Path to CV YAML file
        verbose (bool): Whether to print detailed output
        
    Returns:
        bool: True if validation passes, False otherwise
    """
    validator = CVValidator()
    is_valid, errors, warnings = validator.validate_cv_data(file_path)
    
    if verbose:
        print(f"Validating: {file_path}")
        print(f"Status: {'[VALID]' if is_valid else '[INVALID]'}")
        
        if errors:
            print(f"\nErrors ({len(errors)}):")
            for error in errors:
                print(f"  - {error}")
                
        if warnings:
            print(f"\nWarnings ({len(warnings)}):")
            for warning in warnings:
                print(f"  - {warning}")
                
        if not errors and not warnings:
            print("\nPerfect! No issues found.")
    
    return is_valid

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python cv_validator.py <cv_file.yml>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    is_valid = validate_cv_file(file_path, verbose=True)
    sys.exit(0 if is_valid else 1)