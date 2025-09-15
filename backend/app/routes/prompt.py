from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.prompt import Prompt
from app.db import db
from datetime import datetime

prompt = Blueprint('prompt', __name__)

@prompt.route('/prompts', methods=['GET'])
@jwt_required()
def get_prompts():
    """Get all prompts"""
    try:
        prompts = Prompt.query.all()
        return jsonify({
            'success': True,
            'data': [prompt.to_dict() for prompt in prompts]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prompt.route('/prompts/<int:prompt_id>', methods=['GET'])
@jwt_required()
def get_prompt(prompt_id):
    """Get a specific prompt by ID"""
    try:
        prompt = Prompt.query.get_or_404(prompt_id)
        return jsonify({
            'success': True,
            'data': prompt.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prompt.route('/prompts', methods=['POST'])
@jwt_required()
def create_prompt():
    """Create a new prompt"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'message': 'Text is required'
            }), 400
        
        new_prompt = Prompt(
            text=data['text']
        )
        
        db.session.add(new_prompt)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': new_prompt.to_dict(),
            'message': 'Prompt created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prompt.route('/prompts/<int:prompt_id>', methods=['PUT'])
@jwt_required()
def update_prompt(prompt_id):
    """Update an existing prompt"""
    try:
        prompt = Prompt.query.get_or_404(prompt_id)
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'message': 'Text is required'
            }), 400
        
        prompt.text = data['text']
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': prompt.to_dict(),
            'message': 'Prompt updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prompt.route('/prompts/<int:prompt_id>', methods=['DELETE'])
@jwt_required()
def delete_prompt(prompt_id):
    """Delete a prompt"""
    try:
        prompt = Prompt.query.get_or_404(prompt_id)
        db.session.delete(prompt)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Prompt deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
