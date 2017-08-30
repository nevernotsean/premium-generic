<?php
/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */
global $paged;
if (!isset($paged) || !$paged){
	 $paged = 1;
}
$context = Timber::get_context();
$context['posts'] = Timber::get_posts(array(
	'posts_per_page' => 13,
	'paged' => $paged
));
$context['pagination'] = Timber::get_pagination();

$categories = Timber::get_terms(array('taxonomy' => 'category', 'hide_empty' => true));
$context['categories'] = $categories;

$templates = array( 'index.twig' );
if ( is_home() ) {
	array_unshift( $templates, 'home.twig' );
}
Timber::render( $templates, $context );
