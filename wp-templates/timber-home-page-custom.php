<?php
/*
 * Template Name: Home Page
 * Description: A Page Template for Home
 */

$context = Timber::get_context();
$context['page'] = Timber::get_post();
$context['posts'] = Timber::get_posts('numberposts=5');

Timber::render( array( 'page-home.twig' ), $context );
