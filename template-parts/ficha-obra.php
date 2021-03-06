<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$fields = prompt_obra_metadata( $term->term_id );
$ficha_col_1 = get_term_meta( $term->term_id, '_prompt_ficha_col_1', false );
$ficha_col_2 = get_term_meta( $term->term_id, '_prompt_ficha_col_2', false );
$ficha_col_3 = get_term_meta( $term->term_id, '_prompt_ficha_col_3', false );
?>

<h1>Ficha artística</h1>

<div class="row">
	<dl class="col-md-3 col-7">

		<div class="mini-time">
			<?php echo apply_filters('the_content', $ficha_col_1[0]);?>
		</div>

	</dl>

	<dl class="col-md-3 col-5">
		<?php echo apply_filters('the_content', $ficha_col_2[0]);?>
	</dl>

	<dl class="col-md-3 col-12 offset-md-3">
		<?php echo apply_filters('the_content', $ficha_col_3[0]);?>
	</dl>

</div>

<div class="row">
	<div class="intro-obra col-md-8 col-12">
		<header class="ficha-title">
			<h2>Reseña</h2>
		</header>
		<?php echo $fields['review'][0];?>
	</div>
</div>