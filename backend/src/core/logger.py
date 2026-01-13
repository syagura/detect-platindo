"""
Logging configuration for the application
"""
import logging
import sys
from pathlib import Path
from config.settings import settings

def setup_logger(name: str = __name__) -> logging.Logger:
    """
    Setup and configure logger
    
    Args
        name: Logger name (usually __name__)

    Returns: 
        Configgured logger instance
    """
    logger = logging.getLogger(name)

    # Prevent duplicate handlers
    if logger.handlers:
        return logger
    
    # Set level from settings
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(log_level)

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)

    # Format 
    if settings.LOG_FORMAT == 'detailed':
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
    else:
        formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%H:%M:%S'
        )

    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger

# Application logger 
logger = setup_logger('detectplatindo')