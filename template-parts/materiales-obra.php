<?php 
$term = get_term_by( 'slug', get_query_var( 'term' ), 'obra' );
$playtext = bit_get_play($term->term_id);
?>

<h2 class="standard-title">
	Materiales asociados a la obra
</h2>

<ul class="nav nav-pills materiales-obra" id="materialesTabs" role="tablist" data-play-id="<?php echo $term->term_id;?>">
	<li class="nav-item">
		<a href="#todos" class="nav-link active" data-toggle="tab" id="todosTab" data-function="enableAllMedia" data-getType="gallery" data-play-id="<?php echo $term->term_id;?>">Todos los materiales</a>
	</li>
</ul>

<div class="tab-content" id="materialesTabsContent">
	<div class="tab-pane fade show active" id="todos" role="tabpanel" aria-labelledby="todosTab" >
		<!-- ajax loaded content -->
	</div>

</div>

<div class="modal fade modal-media-text" tabindex="-1" role="dialog" id="modal-media-text-materiales" aria-hidden="true">
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title"><!-- Title here --></h1>
					<span type="button" class="close" data-dismiss="modal" aria-label="Close">
						<i class="fas fa-times"></i>
					</span>
				</div>
				<div class="modal-body">
					<!-- Content here -->
				</div>
			</div>
		</div>
	</div>